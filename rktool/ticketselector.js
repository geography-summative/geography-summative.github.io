
    let tickets = [];
    document.addEventListener("DOMContentLoaded", function() {
            const addTicketBtn = document.getElementById("add-ticket");
            const ticketModal = document.getElementById("ticket-modal");
            const closeModalBtn = document.getElementById("close-modal");
            const confirmTicketBtn = document.getElementById("confirm-ticket");
            const ticketTable = document.getElementById("ticket-table");
            const totalGBPDisplay = document.getElementById("total-gbp");
            const totalEURDisplay = document.getElementById("total-eur");
            const fileInput = document.getElementById("ticket-files");
            const fileList = document.getElementById("file-list");
            const nextBtn = document.getElementById("next");
            
            
            addTicketBtn.addEventListener("click", () => {
                document.getElementById("ticket-date").value = "";
                document.getElementById("ticket-amount").value = "";
                document.getElementById("ticket-description").value = "";
                fileInput.value = "";
                fileList.innerHTML = "";
                ticketModal.classList.remove("hidden");
            });
            
            confirmTicketBtn.addEventListener("click", () => {
                const date = document.getElementById("ticket-date").value;
                const currency = document.getElementById("ticket-currency").value;
                const amount = parseFloat(document.getElementById("ticket-amount").value);
                const description = document.getElementById("ticket-description").value;
              
                const files = Array.from(fileInput.files);

    if (!date || isNaN(amount) || !description) {
        alert("Please fill all fields.");
        return;
    }

    // Ensure files are valid before processing
    const fileObjects = files
        .filter(file => file instanceof Blob) // Ensure only valid file objects
        .map(file => ({
            name: file.name,
            url: URL.createObjectURL(file) // Generate object URL safely
        }));



    if (fileObjects.length === 0) {
        alert("Invalid file selection.");
        return;
    }
                const ticket = { date, currency, amount, description, files: fileObjects};
                console.log(JSON.stringify(ticket));
                tickets.push(ticket);
                renderTickets();
                ticketModal.classList.add("hidden");
            });
            
            ticketTable.addEventListener("click", function(event) {
                if (event.target.classList.contains("remove-ticket")) {
                    const row = event.target.closest("tr");
                    const date = row.dataset.date;
                    const amount = parseFloat(row.dataset.amount);
                    const description = row.dataset.description;
                    tickets = tickets.filter(ticket => !(ticket.date === date && ticket.amount === amount && ticket.description === description));
                    renderTickets();
                }
            });
            
            function renderTickets() {
                ticketTable.innerHTML = "";
                tickets.forEach((ticket, index) => {
                    const row = document.createElement("tr");
                    row.dataset.date = ticket.date;
                    row.dataset.amount = ticket.amount;
                    row.dataset.description = ticket.description;
                    row.innerHTML = `
                        <td class="border p-2">${ticket.date}</td>
                        <td class="border p-2">${ticket.currency} ${ticket.amount.toFixed(2)}</td>
                        <td class="border p-2">${ticket.description}</td>
                        <td class="border p-2">${ticket.files.join(", ")}</td>
                        <td class="border p-2 text-center"><button class="remove-ticket bg-red-500 text-white px-2 py-1 rounded">X</button></td>
                    `;
                    ticketTable.appendChild(row);
                });
                updateTotal();
            }
            
            function updateTotal() {
                let totalGBP = 0, totalEUR = 0;
                tickets.forEach(ticket => {
                    if (ticket.currency === "GBP") totalGBP += ticket.amount;
                    else totalEUR += ticket.amount;
                });
                totalGBPDisplay.textContent = `£${totalGBP.toFixed(2)}`;
                totalEURDisplay.textContent = `€${totalEUR.toFixed(2)}`;
            }
        });

         nextBtn.addEventListener("click", () => {
                document.getElementById("ticket-date").value = "";
                document.getElementById("ticket-amount").value = "";
                document.getElementById("ticket-description").value = "";
                fileInput.value = "";
                fileList.innerHTML = "";
                ticketModal.classList.remove("hidden");
            });


function sendTicketsToCanvas() {
    const carousel = document.getElementById("carouseltarget");
    carousel.innerHTML = ""; // Clear previous content before re-rendering
    document.getElementById("mainform").classList.add("hidden");
    document.getElementById("ticket-container").classList.add("hidden");

    document.getElementById("imagearrange").classList.remove("hidden");

    tickets.forEach((ticket, ticketIndex) => {

        let ticketNumber = ticketIndex + 1; // Assign ticket number dynamically

        ticket.files.forEach((file, fileIndex) => {
            const partNumber = ticket.files.length > 1 ? ` (part ${fileIndex + 1})` : "";
            const title = `Ticket ${ticketNumber}${partNumber}`;
            console.log(JSON.stringify(file));
            console.log(JSON.stringify(title));
            const item = document.createElement("div");
            item.classList.add("carousel-item");
            item.setAttribute("data-src", file.url);
            item.setAttribute("data-title", title);

            item.innerHTML = `
                <img src="${file.url}" alt="${title}">
                <p>${title}</p>
            `;

            carousel.appendChild(item);
                        // Add dragstart event listener to the new carousel item
            item.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", JSON.stringify({ src: file.url, titley: title }));
            });

        });
    });
}
