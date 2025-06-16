document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const monitorContainer = document.getElementById('monitor-container');
    const loadingScreen = document.getElementById('loading-screen');
    const desktop = document.getElementById('desktop');
    const cursor = document.getElementById('cursor');
    const midiIcon = document.getElementById('midi-player-icon');
    const midiWindow = document.getElementById('midi-player-window');
    const music = document.getElementById('music');
    const screen = document.getElementById('screen');
    const biosScreen = document.getElementById('bios-screen');
    const biosText = document.getElementById('bios-text');

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const moveCursorTo = async (element) => {
        const rect = element.getBoundingClientRect();
        const screenRect = screen.getBoundingClientRect();
        
        const targetX = rect.left - screenRect.left + (rect.width / 2);
        const targetY = rect.top - screenRect.top + (rect.height / 2);

        // Randomize transition duration slightly for realism
        const duration = Math.random() * 0.4 + 0.4; // between 0.4s and 0.8s
        cursor.style.transition = `top ${duration}s ease-in-out, left ${duration}s ease-in-out`;
        
        cursor.style.left = `${targetX - cursor.width / 2}px`;
        cursor.style.top = `${targetY - cursor.height / 2}px`;

        await sleep(duration * 1000 + 100); // Wait for cursor to move + a bit more
    };

    const startExperience = async () => {
        document.getElementById('start-container').classList.add('hidden');
        monitorContainer.classList.remove('hidden');

        await runBiosSequence();

        loadingScreen.classList.remove('hidden');
        await sleep(5000); // Wait for loading bar animation (css is 4.5s)

        loadingScreen.classList.add('hidden');
        desktop.classList.remove('hidden');

        await sleep(1000); // Pause before mouse moves

        automateOS();
    };

    const runBiosSequence = async () => {
        biosScreen.classList.remove('hidden');
        const lines = [
            'AMIBIOS(C)1999 American Megatrends Inc.',
            'BIOS Date: 08/15/99 15:30:00',
            'CPU : Genuine Intel Pentium(r) II Processor @ 450MHz',
            'Memory Test : 131072K OK',
            '',
            'Detecting Primary Master ... SuperDisk 120MB',
            'Detecting Primary Slave  ... None',
            'Detecting Secondary Master ... CD-ROM Drive 40X',
            'Detecting Secondary Slave  ... None',
            '',
            'Booting from C:',
            'Starting Windows...',
        ];

        for (const line of lines) {
            biosText.textContent += line + '\n';
            await sleep(Math.random() * 100 + 80); // Random delay for typing effect
        }

        await sleep(1500); // Pause to read the text
        biosScreen.classList.add('hidden');
        biosText.textContent = ''; // Clear for next time
    };

    const automateOS = async () => {
        // 1. Move to MIDI icon
        await moveCursorTo(midiIcon);
        
        // 2. "Double click" icon
        midiIcon.classList.add('selected');
        await sleep(120);
        midiIcon.classList.remove('selected');
        await sleep(80);
        midiIcon.classList.add('selected');
        await sleep(120);
        
        // 3. Open window and remove selection
        midiWindow.classList.remove('hidden');
        makeWindowDraggable(midiWindow, screen);
        midiIcon.classList.remove('selected');


        await sleep(500);

        // 4. Move to play button
        const playButton = midiWindow.querySelector('.play-controls');
        await moveCursorTo(playButton);

        // 5. "Click" play button
        playButton.style.borderStyle = 'inset';
        await sleep(200);
        playButton.style.borderStyle = 'outset';
        
        // 6. Play music
        try {
            await music.play();
        } catch (e) {
            console.error("Audio playback failed. User may need to interact with the page first.", e);
        }
    };

    const makeWindowDraggable = (win, bounds) => {
        const titleBar = win.querySelector('.title-bar');
        let isDragging = false;
        let initialMouseX, initialMouseY;
        let initialWinX, initialWinY;

        titleBar.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;

            initialWinX = win.offsetLeft;
            initialWinY = win.offsetTop;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;

            titleBar.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - initialMouseX;
                const dy = e.clientY - initialMouseY;

                let newX = initialWinX + dx;
                let newY = initialWinY + dy;
                
                const boundsRect = bounds.getBoundingClientRect();

                // Constrain to boundaries
                newX = Math.max(0, Math.min(newX, boundsRect.width - win.offsetWidth));
                newY = Math.max(0, Math.min(newY, boundsRect.height - win.offsetHeight));

                win.style.left = `${newX}px`;
                win.style.top = `${newY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                titleBar.style.cursor = 'grab';
                document.body.style.userSelect = '';
            }
        });
    };

    startBtn.addEventListener('click', startExperience);
});