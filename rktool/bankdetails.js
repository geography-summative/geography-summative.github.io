  const bankContainer = document.getElementById("bank-container");
	   const currencyButtons = document.querySelectorAll(".currency-btn");
            const bankButtons = document.querySelectorAll(".bank-btn");
            const signatureButtons = document.querySelectorAll(".signature-btn");
            const bankDetails = document.getElementById("bank-details");
            const signaturePadCanvas = document.getElementById("signature-pad");
            const signatureUpload = document.getElementById("signature-upload");
           // const signaturePad = new SignaturePad(signaturePadCanvas);


	            currencyButtons.forEach(button => {
                button.addEventListener("click", function() {
                    currencyButtons.forEach(btn => btn.classList.remove("bg-blue-500", "text-white"));
                    this.classList.add("bg-blue-500", "text-white");
                });
            });

            bankButtons.forEach(button => {
                button.addEventListener("click", function() {
                    bankButtons.forEach(btn => btn.classList.remove("bg-blue-500", "text-white"));
                    this.classList.add("bg-blue-500", "text-white");

                    if (this.dataset.value === "iban") {
                        bankDetails.innerHTML = '<label class="block font-semibold">IBAN:</label><input type="text" class="w-full p-2 border rounded" required>';
                    } else {
                        bankDetails.innerHTML = '<label class="block font-semibold">Sort Code:</label><input type="text" class="w-full p-2 border rounded" required><label class="block font-semibold">BIC:</label><input type="text" class="w-full p-2 border rounded" required>';
                    }
                });
            });

              document.addEventListener('DOMContentLoaded', function () {
            const canvas = document.getElementById('signature-pad');
            const signaturePad = new SignaturePad(canvas);

            // Set canvas dimensions explicitly
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const drawBtn = document.getElementById('draw-btn');
            const uploadBtn = document.getElementById('upload-btn');
            const uploadInput = document.getElementById('signature-upload');

            // Show canvas and hide upload input when draw button is clicked
            drawBtn.addEventListener('click', function () {
                canvas.style.display = 'block';
                uploadInput.classList.add('hidden');
                signaturePad.clear(); // Clear the canvas
            });

            // Show upload input and hide canvas when upload button is clicked
            uploadBtn.addEventListener('click', function () {
                canvas.style.display = 'none';
                uploadInput.classList.remove('hidden');
            });

            // Handle file upload
            uploadInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const img = new Image();
                        img.src = e.target.result;
                        img.onload = function () {
                            const ctx = canvas.getContext('2d');

                            // Calculate aspect ratio and resize the canvas to fit the image
                            const maxWidth = canvas.offsetWidth;
                            const maxHeight = canvas.offsetHeight;
                            let width = img.width;
                            let height = img.height;

                            if (width > maxWidth || height > maxHeight) {
                                const aspectRatio = width / height;
                                if (width > height) {
                                    width = maxWidth;
                                    height = width / aspectRatio;
                                } else {
                                    height = maxHeight;
                                    width = height * aspectRatio;
                                }
                            }

                            // Set canvas dimensions and draw the image
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);
                        };
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Handle the "Next" button click
            document.getElementById('confirm-bank').addEventListener('click', function () {
                if (!signaturePad.isEmpty()) {
                    const signatureData = signaturePad.toDataURL(); // Get signature as data URL
                    console.log('Signature Data:', signatureData);
                    alert('Signature saved!');
                } else {
                    alert('Please provide a signature.');
                }
            });
        });