import React, { useState } from 'react';

import Dialog from '../ui/Dialog';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

const style = {
    container: {
        display: "flex",
        flexFlow: "column nowrap",
        height: "100%",
        textAlign: "center",
    },
}

const InfoPane = (/*{ children }*/) => {
    const [dialog, setDialog] = useState({
        visible: false,
        onAccept: () => {},
        onReject: () => {},
        onCancel: () => {},
    });

    const showDialog = (onAccept, onReject, onCancel) => {
        setDialog({
            visible: true,
            onAccept: onAccept,
            onReject: onReject,
            onCancel: onCancel,
        });
    }

    const hideDialog = () => {
        setDialog({ visible: false });
    }

    const handleDialog = () => {
        showDialog(
            () => {toast("Mehheeh!"); hideDialog();}, // onAccept
            () => {toast("Mary had a little lamb!"); hideDialog();}, // onReject
            () => {toast("It's not hard! try recollecting the poem."); hideDialog();}, // onCancel
        );
    }
  
    return (
        <div style={style.container}>
            <Button onClick={handleDialog}>Dialog Test</Button>
            <p>Welcome!</p>
            <p>Theme options have been migrated to Settings page</p>
            <Dialog config={dialog}>Does mary have a horse?</Dialog>
        </div>
    );
};

export default InfoPane