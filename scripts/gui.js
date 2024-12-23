import GUI from 'lil-gui';

let gui = null; // GUI referansı
let initialValues = {}; // Objelerin ilk değerlerini tutacak

export function setupGUI(selectedObject) {
   // if (gui) {
   //     gui.destroy(); // Eski GUI'yi temizle
    //}

    if (!selectedObject) {
        return; // Eğer obje seçilmediyse GUI'yi oluşturma
    }

    // Objeyi ilk haline sakla
    if (!initialValues[selectedObject.uuid]) {
        initialValues[selectedObject.uuid] = {
            position: { ...selectedObject.position },
            rotation: { ...selectedObject.rotation },
            scale: { ...selectedObject.scale }
        };
    }

    gui = new GUI();
    const scaleFolder = gui.addFolder('Scale');

    const scaleX = scaleFolder.add(selectedObject.scale, 'x', 0.1, 5).name('Scale X').step(0.1);
    const scaleY = scaleFolder.add(selectedObject.scale, 'y', 0.1, 5).name('Scale Y').step(0.1);
    const scaleZ = scaleFolder.add(selectedObject.scale, 'z', 0.1, 5).name('Scale Z').step(0.1);

    scaleFolder.open(); // Varsayılan olarak aç

    // Reset (ilk haline döndürme) butonunu ekle
    gui.add({ reset: () => resetObject(selectedObject) }, 'reset').name('Reset to Initial');

    // Resetleme işlemi sonrasında GUI'nin güncellenmesi için gerekli fonksiyon
    function resetObject(obj) {
        if (initialValues[obj.uuid]) {
            const initial = initialValues[obj.uuid];
            //obj.position.set(initial.position.x, initial.position.y, initial.position.z);
            //obj.rotation.set(initial.rotation.x, initial.rotation.y, initial.rotation.z);
            obj.scale.set(initial.scale.x, initial.scale.y, initial.scale.z);

            // GUI değerlerini güncelle
            scaleX.updateDisplay();
            scaleY.updateDisplay();
            scaleZ.updateDisplay();
        }
    }
}
