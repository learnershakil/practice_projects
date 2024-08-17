import tkinter as tk
import re
import threading
from tkinter import messagebox, filedialog

class EmailExtractor(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Email Extractor")
        self.geometry("500x300")
        
        self.create_widgets()

    def create_widgets(self):
        self.text_input = tk.Text(self, height=10, width=50)
        self.text_input.pack(padx=10, pady=10)

        self.extract_button = tk.Button(self, text="Extract Emails", command=self.extract_emails)
        self.extract_button.pack(padx=10, pady=5)

        self.clear_button = tk.Button(self, text="Clear", command=self.clear_text)
        self.clear_button.pack(padx=10, pady=5)

        self.save_button = tk.Button(self, text="Save Emails", command=self.save_emails)
        self.save_button.pack(padx=10, pady=5)

        self.email_output = tk.Text(self, height=10, width=50)
        self.email_output.pack(padx=10, pady=10)

    def extract_emails(self):
        text = self.text_input.get("1.0", "end-1c")
        if not text:
            messagebox.showwarning("Empty Text", "Please enter some text to extract emails.")
            return

        # Disable buttons during extraction
        self.extract_button.config(state="disabled")
        self.clear_button.config(state="disabled")
        self.save_button.config(state="disabled")

        # Start extraction in a separate thread
        thread = threading.Thread(target=self.perform_extraction, args=(text,))
        thread.start()

    def perform_extraction(self, text):
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', text)

        # Update the GUI with extracted emails
        self.email_output.delete("1.0", "end")
        if emails:
            for email in emails:
                self.email_output.insert("end", email + "\n")
            messagebox.showinfo("Extraction Complete", "Email extraction is complete.")
        else:
            self.email_output.insert("end", "No email addresses found.")
            messagebox.showinfo("Extraction Complete", "No email addresses found.")

        # Re-enable buttons after extraction
        self.extract_button.config(state="normal")
        self.clear_button.config(state="normal")
        self.save_button.config(state="normal")

    def clear_text(self):
        self.text_input.delete("1.0", "end")
        self.email_output.delete("1.0", "end")

    def save_emails(self):
        emails = self.email_output.get("1.0", "end-1c")
        if not emails:
            messagebox.showwarning("No Emails", "No emails to save.")
            return

        file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text Files", "*.txt")])
        if file_path:
            try:
                with open(file_path, "w") as file:
                    file.write(emails)
                messagebox.showinfo("Save Complete", "Emails saved successfully.")
            except Exception as e:
                messagebox.showerror("Save Error", f"An error occurred while saving emails:\n{str(e)}")

if __name__ == "__main__":
    app = EmailExtractor()
    app.mainloop()