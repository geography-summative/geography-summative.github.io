
        document.getElementById('firstpage').setAttribute('ondragover', 'allowDrop(event)');
        document.getElementById('firstpage').setAttribute('ondrop', 'drop(event)');



        document.getElementById('add-page').addEventListener('click', () => {
            const newPage = document.createElement('div');
            newPage.className = 'a4-sheet';
            newPage.setAttribute('ondragover', 'allowDrop(event)');
            newPage.setAttribute('ondrop', 'drop(event)');
            document.getElementById('a4-sheets').appendChild(newPage);
        });

       

        function allowDrop(event) {
            event.preventDefault();
        }

        function drop(event) {
            event.preventDefault();
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            const { src, titley } = data;
            const sheet = event.currentTarget;
            
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';
            imgContainer.style.left = `${event.offsetX}px`;
            imgContainer.style.top = `${event.offsetY}px`;

            const title = document.createElement('p');
            title.className = 'image-title';
            title.textContent = titley;
     
            
            const img = document.createElement('img');
            img.src = src;
            img.style.width = '100px';
            img.style.height = 'auto';
            img.draggable = false;
            
            const removeButton = document.createElement('div');
            removeButton.className = 'remove-button';
            removeButton.textContent = '×';
            removeButton.onclick = () => {
                imgContainer.remove();
                showInCarousel(src);
            };
           
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            
           
            imgContainer.appendChild(img);
             imgContainer.appendChild(title);
            imgContainer.appendChild(removeButton);
            imgContainer.appendChild(resizeHandle);
            sheet.appendChild(imgContainer);

            hideInCarousel(src);
            
            let isResizing = false;
            let startX, startY, startWidth, startHeight, aspectRatio;
            
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = img.clientWidth;
                startHeight = img.clientHeight;
                aspectRatio = startWidth / startHeight;
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isResizing) {
                    const deltaX = e.clientX - startX;
                    const newWidth = startWidth + deltaX;
                    const newHeight = newWidth / aspectRatio;
                    img.style.width = `${newWidth}px`;
                    img.style.height = `${newHeight}px`;
                }
            });
            
            document.addEventListener('mouseup', () => {
                isResizing = false;
            });
            
            imgContainer.addEventListener('mousedown', (e) => {
                if (e.target === resizeHandle) return;
                let startX = e.clientX - imgContainer.offsetLeft;
                let startY = e.clientY - imgContainer.offsetTop;
                
                function move(e) {
                    let newX = e.clientX - startX;
                    let newY = e.clientY - startY;
                    
                    // Keep within page boundaries
                    const maxX = sheet.clientWidth - imgContainer.clientWidth;
                    const maxY = sheet.clientHeight - imgContainer.clientHeight;
                    
                    imgContainer.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
                    imgContainer.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
                }
                
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', () => {
                    document.removeEventListener('mousemove', move);
                }, { once: true });
            });
        }

        function showInCarousel(src) {
            const items = document.querySelectorAll('.carousel-item');
            items.forEach(item => {
                if (item.getAttribute('data-src') === src) {
                    item.style.display = 'flex';
                }
            });
            checkCarousel();
        }

        function hideInCarousel(src) {
            const items = document.querySelectorAll('.carousel-item');
            items.forEach(item => {
                if (item.getAttribute('data-src') === src) {
                    item.style.display = 'none';
                }
            });
            checkCarousel();
        }

        function checkCarousel() {
            const items = document.querySelectorAll('.carousel-item');
            const visibleItems = Array.from(items).some(item => item.style.display !== 'none');
            document.getElementById('next-button').style.display = visibleItems ? 'none' : 'block';
        }

       function exportPages() {
    const sheets = document.querySelectorAll('.a4-sheet');
    const uriList = []; // Array to store the URIs

    sheets.forEach((sheet, index) => {
        const hasItems = sheet.querySelectorAll('.image-container').length > 0;

        if (hasItems) {
            // Hide remove and resize buttons
            const buttons = sheet.querySelectorAll('.remove-button, .resize-handle');
            buttons.forEach(button => {
                button.style.display = 'none';
            });

            // Use html2canvas to capture the sheet as an image
            html2canvas(sheet).then(canvas => {
                // Convert the canvas to a data URL
                const imgData = canvas.toDataURL('image/png');

                // Add the data URL to the list
                uriList.push({
                    pageNumber: index + 1,
                    uri: imgData
                });

                // Restore remove and resize buttons after export
                buttons.forEach(button => {
                    button.style.display = 'block'; // Or the original display value
                });

                // Log the URI list after processing all sheets
                if (index === sheets.length - 1) {
                    console.log('URI List:', uriList);
                }
            });
        } else {
            console.log(`Skipping page ${index + 1} (no items)`);
        }
        document.getElementById("imagearrange").classList.add("hidden");
        document.getElementById("mainform").classList.remove("hidden");
        document.getElementById("bank-container").classList.remove("hidden");
    });
}
        document.getElementById('export-sheets').addEventListener('click', () => {
            exportPages();
        });
  