import React, { createContext, useContext, useState, useCallback } from "react";

// Create a context to share notifications and modals across your app
const NotificationContext = createContext();

// Provider component that wraps your app and gives access to notifications
export const NotificationProvider = ({ children }) => {
  // ----- STATE -----
  // `toast` will hold info for temporary notifications (like "Saved!" messages)
  const [toast, setToast] = useState(null);

  // `modal` will hold info for a confirmation modal (title, message, callbacks)
  const [modal, setModal] = useState(null);

  // ----- TOAST FUNCTION -----
  // This function is used to show a toast notification
  // `message` is the text to display, `type` is optional: "info", "success", "error"
  const notify = useCallback((message, type = "info") => {
    setToast({ message, type }); // show the toast
    setTimeout(() => setToast(null), 4000); // auto-hide after 4 seconds
  }, []);

  // ----- MODAL FUNCTION -----
  // This function is used to show a confirmation modal
  // You can pass: title, message, onConfirm callback, onCancel callback
  const confirm = useCallback(({ title = "Confirm", message, onConfirm, onCancel }) => {
    setModal({ title, message, onConfirm, onCancel }); // show the modal
  }, []);

  // ----- HANDLERS FOR MODAL BUTTONS -----
  const handleConfirm = () => {
    // Run the user's onConfirm function if it exists
    modal?.onConfirm?.();
    setModal(null); // close the modal
  };

  const handleCancel = () => {
    // Run the user's onCancel function if it exists
    modal?.onCancel?.();
    setModal(null); // close the modal
  };

  // ----- PROVIDER -----
  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}

      {/* ----- TOAST UI ----- */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white z-50
            ${toast.type === "success" ? "bg-green-500" : ""}
            ${toast.type === "error" ? "bg-red-500" : ""}
            ${toast.type === "info" ? "bg-blue-500" : ""}`}
        >
          {toast.message}
        </div>
      )}

      {/* ----- CONFIRM MODAL UI ----- */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            {/* Modal title */}
            <h2 className="text-lg font-semibold text-black mb-4">
              {modal.title}
            </h2>
            {/* Modal message */}
            <p className="text-gray-700 mb-6">{modal.message}</p>
            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-full bg-black text-white hover:opacity-90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Custom hook to easily access notifications and modal functions
export const useNotification = () => useContext(NotificationContext);
