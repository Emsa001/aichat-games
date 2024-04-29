function StartTimer(startTime: number, setTimer: any): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimer(startTime);
        const intervalId = setInterval(() => {
            setTimer((prevTimer: any) => prevTimer - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            setTimer(0);
            resolve();
        }, startTime * 1000);
    });
}

export { StartTimer };