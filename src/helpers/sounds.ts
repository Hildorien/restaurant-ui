import doorbell from '../assets/sounds/doorbell.wav';


export async function playSound() {
    var doorBell = new Audio(doorbell);
    doorBell.crossOrigin = 'anonymous';
    await doorBell.play()
    .then(() => {
        //Audio played
    })
    .catch(async (error) => {
        doorBell.load();
        await doorBell.play();
    });
}
