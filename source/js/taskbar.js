export function updateTime() {
    const time = document.getElementById("taskbar-time");
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
    time.textContent = formattedTime;
}