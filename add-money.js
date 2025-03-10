import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithCustomToken, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBO7vHvxfsRImHYoyrADhCENoLnbMbNNO0",
  authDomain: "sanwariya-9e5b1.firebaseapp.com",
  projectId: "sanwariya-9e5b1",
  storageBucket: "sanwariya-9e5b1.firebasestorage.app",
  messagingSenderId: "1054330094963",
  appId: "1:1054330094963:web:e12fd26f4d9d3d32bb7106",
  measurementId: "G-KVDVTBNPX0"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Set persistence so login state persists across page loads
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to local storage.");
    })
    .catch(error => {
        console.error("Error setting persistence:", error);
    });

// Check URL for a token (passed from the app)
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if("eyJhbGciOiJSUzI1NiIsImtpZCI6ImJjNDAxN2U3MGE4MWM5NTMxY2YxYjY4MjY4M2Q5OThlNGY1NTg5MTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2Fud2FyaXlhLTllNWIxIiwiYXVkIjoic2Fud2FyaXlhLTllNWIxIiwiYXV0aF90aW1lIjoxNzQxNTk2NzU4LCJ1c2VyX2lkIjoiRnJ2ckRTWDZZQ05jYVdzUUMwMUJPUFlvOHV2MiIsInN1YiI6IkZydnJEU1g2WUNOY2FXc1FDMDFCT1BZbzh1djIiLCJpYXQiOjE3NDE1OTY3NjMsImV4cCI6MTc0MTYwMDM2MywiZW1haWwiOiI3NzI2ODIxOTU3QGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbIjc3MjY4MjE5NTdAZXhhbXBsZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.OoLa27Q4dwZKDJsll8rS56eMPG7Y8dTgsiwfmqMpF8I_i1EKt2gdTt4pBNPKCuHAZ50fjuSuGeqGMwtO0yZNcLJpUTdK_FgyYJvBY-E2MxXZwb9d1WJrm7Hqf2HT8XSE4JCgI8847uqmNoMuI5n2S_-ALioXMUlEsZkkihkq5ia8jf83mAPt7Pj8b74h-nII_8sgUIdyHzs6Gi7Abem-NV5byaaCqfIH8qW1hyhoF_B4WNsijVvSSrTkyrWrL0MAkkdrNq2Swf_2j5WBnJhvBB-e0m2ofiG23KaYH15eUkKcvyV37af-ChipkTKgKao1Ave8FdSXECjF-VVCRtztDA"){    
  console.log("🔑 Token found in URL:", token);
    
    signInWithCustomToken(auth, token)
        .then(userCredential => {
            alert("✅ Successfully signed in:", userCredential.user);
        })
        .catch(error => {
            console.error("❌ Authentication Error:", error.code, error.message);
            alert(`Authentication failed: ${error.message}`);
        });
} else {
    console.warn("⚠️ No token found in the URL.");
}

onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
        const userId = currentUser.uid;
        const phone = currentUser.phoneNumber || currentUser.email;
        console.log("User authenticated. ID:", userId, "Phone:", phone);

        // Fetch balance and transaction history after authentication
        fetchBalance();
        fetchHistory();
    } else {
        console.error("No user logged in");
        alert("You must be logged in to perform this action.");
    }
});

// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBO7vHvxfsRImHYoyrADhCENoLnbMbNNO0",
//     authDomain: "sanwariya-9e5b1.firebaseapp.com",
//     projectId: "sanwariya-9e5b1",
//     storageBucket: "sanwariya-9e5b1.firebasestorage.app",
//     messagingSenderId: "1054330094963",
//     appId: "1:1054330094963:web:e12fd26f4d9d3d32bb7106",
//     measurementId: "G-KVDVTBNPX0"
//   };

// // Initialize Firebase and Firestore
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // **TEST MODE** - Set this to `false` before deploying
// const isTesting = true;

// let userId = "";
// let phone = "";

// // **For testing without login, use hardcoded values**
// if (isTesting) {
//     userId = "9664361536";
//     phone = "9664361536";
// } else {
//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {
//             userId = user.uid;
//             phone = user.phoneNumber || user.email;
//             fetchBalance();
//             fetchHistory();
//         } else {
//             alert("You should log in first to perform this action.");
//         }
//     });
// }

document.addEventListener('DOMContentLoaded', async () => {
    const manualSubmitButton = document.getElementById('manual-submit-button');
    const manualUtrInput = document.getElementById('manual-utr');
    const amountInput = document.getElementById('amount');
    const historyTableBody = document.querySelector('#add-money-requests-table tbody');
    const historyModal = document.getElementById('payment-history-modal');
    const viewHistoryButton = document.getElementById('view-history-button');
    const closeHistoryButton = document.getElementById('close-history-button');
    const messageBox = document.getElementById('add-money-message'); // Element to show success message

    // Fetch and display balance
    async function fetchBalance() {
        try {
            const userDoc = await getDoc(doc(db, "users", phone));
            if (userDoc.exists()) {
                document.getElementById('available-balance').textContent = userDoc.data().balance || 0;
            } else {
                document.getElementById('available-balance').textContent = 0;
            }
        } catch (err) {
            console.error('Error fetching balance:', err);
        }
    }

    // Submit add money request
    async function submitAddMoneyRequest(utr) {
        const amount = parseInt(amountInput.value);

        if (!amount || amount < 100) {
            alert('Minimum amount should be ₹100.');
            return;
        }

        if (!utr.trim()) {
            alert('Please enter a valid UTR number.');
            return;
        }

        try {
            await addDoc(collection(db, "add_money_requests"), {
                userId,
                amount,
                utr,
                status: "Pending",
            });

            showMessage('Details submitted successfully! Awaiting admin confirmation.', 'success');
            fetchHistory();
        } catch (err) {
            console.error('Error submitting request:', err);
        }
    }

    async function fetchUPIID() {
        try {
            const upiCollection = collection(db, "settings");
            const upiSnapshot = await getDocs(upiCollection);
    
            if (!upiSnapshot.empty) {
                // Assuming there's only one document in the "upi" collection
                const upiDoc = upiSnapshot.docs[0].data();
                const upiId = upiDoc.upi_id;  // Ensure the field name in Firestore is `upi_id`
    
                // Update the UI with the fetched UPI ID
                document.getElementById("upi-id").textContent = upiId;
            } else {
                console.warn("No UPI ID found in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching UPI ID:", error);
        }
    }

    // Function to show messages dynamically
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.style.display = 'block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    }

    // Fetch and display request history
    async function fetchHistory() {
        try {
            const q = query(collection(db, "add_money_requests"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            historyTableBody.innerHTML = '';
            querySnapshot.forEach((doc, index) => {
                const request = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>₹${request.amount}</td>
                    <td>${request.utr || 'N/A'}</td>
                    <td>${request.status}</td>
                `;
                historyTableBody.appendChild(row);
            });
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    }

    window.copyUPI = function() {
        const upiId = document.getElementById("upi-id").textContent;
        if (upiId && upiId !== "Fetching UPI ID...") {
            navigator.clipboard.writeText(upiId)
                .then(() => alert("UPI ID copied: " + upiId))
                .catch(err => console.error("Error copying UPI ID:", err));
        }
    };

    manualSubmitButton.addEventListener('click', () => {
        submitAddMoneyRequest( manualUtrInput.value.trim());
    });

    // Open History Modal
    viewHistoryButton.addEventListener('click', async () => {
        await fetchHistory();
        historyModal.style.display = 'block';
    });

    // Close History Modal
    closeHistoryButton.addEventListener('click', () => {
        historyModal.style.display = 'none';
    });

    // Close Modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === historyModal) {
            historyModal.style.display = 'none';
        }
    });

    // Initialize
    fetchUPIID();
    fetchBalance();
    fetchHistory();
});
