document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('mousedown', function(event) {
        const windows = document.querySelectorAll('.window');

        windows.forEach(window => {
            const title = window.querySelector('.title-bar');
            if (!window.contains(event.target)) {
            title.classList.add('inactive');
        } else {
            title.classList.remove('inactive');
        }
        });
    });

    document.addEventListener('mousedown', function(event) {
        const title = event.target.closest('.title-bar');
        if (!title) return;

        const window = title.closest('.window');
        if (!window) return;

        let isDragging = false;
        let startX, startY, initialX, initialY;
        const taskbar = document.querySelector('.taskbar');
        const taskbarHeight = taskbar ? taskbar.offsetHeight : 0;

        if (isLeftClick(event)) {
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;
            initialX = window.offsetLeft;
            initialY = window.offsetTop;

            title.classList.remove('inactive');

            // Prevent text selection while dragging
            event.preventDefault();
        }

        function onMouseMove(e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                const bodyWidth = document.body.clientWidth;
                const bodyHeight = document.body.clientHeight;

                let newLeft = initialX + dx;
                let newTop = initialY + dy;

                // Apply horizontal boundaries
                if (e.clientX >= 0 && e.clientX <= bodyWidth) {
                    window.style.left = `${newLeft}px`;
                }

                // Apply vertical boundaries, considering the taskbar height
                if (e.clientY >= 0 && e.clientY <= (bodyHeight - taskbarHeight)) {
                    window.style.top = `${newTop}px`;
                }

                e.preventDefault();
            }
        }

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', function stopDragging() {
            isDragging = false;

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', stopDragging);
        });
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.matches(".title-bar-controls button[aria-label='Close']")) {
            const window = e.target.closest('.window');
            if (window) {
                // Remove the window from the DOM
                window.remove();
            }
        }
    });
});

function isLeftClick(e) {
    // Return true if left click
    return e.button === 0;
}