export default function Feature({mode, img, h2, p}) {
    return (
        <div className="feature" style={{ backgroundColor: mode.card }}>
            <img src={`/pics/${img}`} alt="" />
            <h2 style={{ color: mode.txt }}>{h2}</h2>
            <p style={{ color: mode.txt }}>{p}</p>
        </div>
    )
}