import './Main.css';
import Feature from './Feature';
import { Link } from 'react-router-dom';

export default function Main({ mode }) {
    let text = mode.txt;
    return (
        <main style={{ width: '100%', height: '90vh', backgroundColor: mode.mainBG }}>
            <div id="topCard">
                <h1 style={{ color: text }}>Test Your Knowledge</h1>
                <p style={{ color: text }}>Challenge yourself with our diverse range of quizzes and track your progress.</p>
                <Link to="/reg" id="get-started-button" style={{ color: mode.navTxt, backgroundColor: mode.button }}>Get Started</Link>
            </div>

            <div id="features" style={{ backgroundColor: mode.mainBG }}>
                <Feature mode={mode} img={'custom.webp'} h2={'Create Custom Quizzes'} p={'Create Quizzes and challenge your friends, all without any charge'} />
                <Feature mode={mode} img={'leader.webp'} h2={'Friends Leaderboards'} p={'Monitor your performance with adrenaline rushing by the competition'} />
                <Feature mode={mode} img={'compete.png'} h2={'Compete with Friends'} p={'Challenge your friends and see who scores the highest!'} />
            </div>
        </main>
    )
}