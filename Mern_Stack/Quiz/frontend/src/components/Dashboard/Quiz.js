function Quiz({title, time, open}) {
    return (
        <div className="quiz hoverable" onClick={()=>open()}>
            <h3 className='qn'>{title}</h3>
            <div className='qt'>{time} min</div>
        </div>
    )
}

export default Quiz;