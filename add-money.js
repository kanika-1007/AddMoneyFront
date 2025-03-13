
import { initializeApp } from "./node_modules/@firebase/app"
import { getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc } from "./node_modules/@firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithCustomToken, setPersistence, browserLocalPersistence } from "./node_modules/@firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBO7vHvxfsRImHYoyrADhCENoLnbMbNNO0",
    authDomain: "sanwariya-9e5b1.firebaseapp.com",
    projectId: "sanwariya-9e5b1",
    storageBucket: "sanwariya-9e5b1.firebasestorage.app",
    messagingSenderId: "1054330094963",
    appId: "1:1054330094963:web:e12fd26f4d9d3d32bb7106",
    measurementId: "G-KVDVTBNPX0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Set authentication persistence
setPersistence(auth, browserLocalPersistence)
    .then(() => alert("Persistence set to local storage."))
    .catch(error => alert("Error setting persistence:", error));

// Authenticate user via token in URL
async function authenticateUser() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
        alert("No token found in the URL.");
        document.getElementById("authStatus").innerText = "Authentication failed. No token provided.";
        return;
    }

    try {
        const userCredential = await signInWithCustomToken(auth, token);
        alert("User signed in:", userCredential.user);
        document.getElementById("authStatus").innerText = `Welcome, ${userCredential.user.email || "User"}`;
    } catch (error) {
        alert("Authentication failed:", error);
        document.getElementById("authStatus").innerText = "Authentication failed. Please try again.";
    }
}

// Fetch and display balance
async function fetchBalance(phone) {
    try {
        const userDoc = await getDoc(doc(db, "users", phone));
        document.getElementById('available-balance').textContent = userDoc.exists() ? userDoc.data().balance || 0 : 0;
    } catch (err) {
        console.error('Error fetching balance:', err);
    }
}

// Submit add money request
async function submitAddMoneyRequest(userId, amount, utr) {
    if (!amount || amount < 100) {
        alert('Minimum amount should be ₹100.');
        return;
    }

    if (!utr.trim()) {
        alert('Please enter a valid UTR number.');
        return;
    }

    try {
        await addDoc(collection(db, "add_money_requests"), { userId, amount, utr, status: "Pending" });
        showMessage('Details submitted successfully! Awaiting admin confirmation.', 'success');
        fetchHistory(userId);
    } catch (err) {
        console.error('Error submitting request:', err);
    }
}

// Fetch UPI ID from Firestore
async function fetchUPIID() {
    try {
        const upiCollection = collection(db, "settings");
        const upiSnapshot = await getDocs(upiCollection);
        
        if (!upiSnapshot.empty) {
            const upiId = upiSnapshot.docs[0].data().upi_id;
            document.getElementById("upi-id").textContent = upiId;
        } else {
            console.warn("No UPI ID found in Firestore.");
        }
    } catch (error) {
        console.error("Error fetching UPI ID:", error);
    }
}

// Show messages dynamically
function showMessage(message, type) {
    const messageBox = document.getElementById('add-money-message');
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    messageBox.style.display = 'block';
    setTimeout(() => messageBox.style.display = 'none', 5000);
}

// Fetch and display request history
async function fetchHistory(userId) {
    try {
        const q = query(collection(db, "add_money_requests"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const historyTableBody = document.querySelector('#add-money-requests-table tbody');
        historyTableBody.innerHTML = '';
        
        querySnapshot.forEach(doc => {
            const request = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `<td>₹${request.amount}</td><td>${request.utr || 'N/A'}</td><td>${request.status}</td>`;
            historyTableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error fetching history:', err);
    }
}

// Copy UPI ID to clipboard
window.copyUPI = function() {
    const upiId = document.getElementById("upi-id").textContent;
    if (upiId && upiId !== "Fetching UPI ID...") {
        navigator.clipboard.writeText(upiId)
            .then(() => alert("UPI ID copied: " + upiId))
            .catch(err => console.error("Error copying UPI ID:", err));
    }
};

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
    const manualSubmitButton = document.getElementById('manual-submit-button');
    const manualUtrInput = document.getElementById('manual-utr');
    const amountInput = document.getElementById('amount');
    const viewHistoryButton = document.getElementById('view-history-button');
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            const phone = user.phoneNumber || user.email;
            fetchBalance(phone);
            fetchHistory(userId);
            
            manualSubmitButton.addEventListener('click', () => submitAddMoneyRequest(userId, parseInt(amountInput.value), manualUtrInput.value));
            viewHistoryButton.addEventListener('click', () => fetchHistory(userId));
        } else {
            console.error("No user logged in");
            alert("You must be logged in to perform this action.");
        }
    });
    fetchUPIID();
});
