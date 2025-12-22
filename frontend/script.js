function predict() {
    const nama = document.getElementById("nama").value.trim();
    if (nama === "") {
        alert("Masukkan nama pasien!");
        return;
    }

    const getInt = (id) => parseInt(document.getElementById(id).value, 10);
    const getFloat = (id) => parseFloat(document.getElementById(id).value);

    const data = {
        age: getInt("age"),
        sex: getInt("sex"),
        cp: getInt("cp"),
        trestbps: getInt("trestbps"),
        chol: getInt("chol"),
        fbs: getInt("fbs"),
        restecg: getInt("restecg"),
        thalach: getInt("thalach"),
        exang: getInt("exang"),
        oldpeak: getFloat("oldpeak"),
        slope: getInt("slope"),
        ca: getInt("ca"),
        thal: getInt("thal")
    };

    console.log("📤 Data ke API:", data);

    for (let key in data) {
        if (isNaN(data[key])) {
            alert("Input tidak valid pada: " + key);
            return;
        }
    }

    fetch("https://mariajosephine-heart-disease-api.hf.space/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log("📥 Response API:", res);

        const resultBox = document.getElementById("result");

        if (res.error) {
            resultBox.innerText = "Error: " + res.error;
            resultBox.style.color = "red";
            return;
        }

        const prob = res.probability;

        if (res.result === 1) {
            resultBox.innerHTML = `💔 ${nama} berisiko terkena penyakit jantung.<br>
                                   <small>Probabilitas: ${prob}</small>`;
            resultBox.style.color = "red";
        } else {
            resultBox.innerHTML = `💖 ${nama} tidak berisiko terkena penyakit jantung.<br>
                                   <small>Probabilitas: ${prob}</small>`;
            resultBox.style.color = "green";
        }
    })
    .catch(err => {
        const resultBox = document.getElementById("result");
        resultBox.innerText = "Terjadi kesalahan koneksi ke server!";
        resultBox.style.color = "red";
    });
}
