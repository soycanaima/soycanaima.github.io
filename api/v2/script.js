document.getElementById("loading").innerHTML = "Ejecutando JavaScript...<br>Cargando assets..."
document.getElementById("fontStylesheet").disabled = false
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("mainContainer").style.display = null
    document.getElementById("serverInfo").style.display = "block"
    document.getElementById("loading").style.display = "none"
})


switch (true) {
    case document.cookie.slice(-2) == "==":
        elementsData = JSON.parse(atob(document.cookie.slice(9, -2)))
        break
    case document.cookie.slice(-1) == "=":
        elementsData = JSON.parse(atob(document.cookie.slice(9, -1)))
        break
    case document.cookie.slice(-1) !== "=":
        if (document.cookie !== "") {
            elementsData = JSON.parse(atob(document.cookie.slice(9)))
            break
        }
    default:
        elementsData = {}
        break
}


entry = {}
entry.selected = "e1"
entry.amount = 0


entry.amount = Object.keys(elementsData).length
for (let i = 1; i <= entry.amount; i++) {
    if (elementsData["e" + i] !== undefined) {
        let newElement = document.createElement("span")
        newElement.id = "e" + i
        newElement.className = "listEntry"
        newElement.innerHTML = elementsData["e" + i].name
        document.getElementById("entryContainer").appendChild(newElement)
    } else {
        entry.amount++
    }
}


selectEntry("e1")


document.getElementById("entryContainer").addEventListener("mousedown", function(event) {
    if (event.button === 0 && event.target.getAttribute("id") !== "entryContainer") {
        selectEntry(event.target.getAttribute("id"))
    }
    if (event.button === 1 && event.target.getAttribute("id") !== "entryContainer") {
        deleteEntry(event.target.getAttribute("id"))
    }
})
document.getElementById("download2").addEventListener("click", function() {
    if (elementsData[entry.selected] !== undefined) {
        navigator.clipboard.writeText(elementsData[entry.selected].link)
    } else {
        navigator.clipboard.writeText("https://www.youtube.com/watch?v=eUUg7OCNRtc")
    }
})

function selectEntry(id) {
    if (document.getElementById(id) !== null) {
        if (document.getElementById(entry.selected) !== null) {
            document.getElementById(entry.selected).style = null
        }
        entry.selected = id
        document.getElementById(entry.selected).style.backgroundColor = "#FFFFFF17"
    } else {
        for (let i = 1; i <= entry.amount; i++) {
            if (document.getElementById("e" + i) !== null) {
                if (document.getElementById(entry.selected) !== null) {
                    document.getElementById(entry.selected).style = null
                }
                entry.selected = "e" + i
                document.getElementById(entry.selected).style.backgroundColor = "#FFFFFF17"
                i = entry.amount
            }
        }
    }
    updateButtons()
}
function deleteEntry(id) {
    document.getElementById(id).remove()
    delete elementsData[id]
    if (id === entry.selected) {
        selectEntry("e1")
    }
    saveCookie()
}
function updateButtons() {
    if (elementsData[entry.selected] !== undefined) {
        document.getElementById("download1").setAttribute("href", elementsData[entry.selected].link)
    } else {
        document.getElementById("download1").setAttribute("href", "https://www.youtube.com/watch?v=eUUg7OCNRtc")
    }
}

function saveCookie() {
    encodedCookie = btoa(JSON.stringify(elementsData))

    currentTime = new Date()
    let expirationDate = new Date(currentTime.getFullYear() + 3, currentTime.getMonth(), currentTime.getDate())
    let expires = "expires=" + expirationDate.toUTCString()

    document.cookie = "elements =" + encodedCookie + "; SameSite=Strict; " + expires
}


compactMode()
window.addEventListener("resize", compactMode)
function compactMode() {
    if (window.innerHeight < 575) {
        document.getElementById("mainContainer").style.height = window.innerHeight + "px"
        document.getElementById("mainBox").style.height = window.innerHeight - 124 + "px"
        document.getElementById("listBox").style.height = window.innerHeight - 194 + "px"
    } else {
        document.getElementById("mainContainer").style.height = null
        document.getElementById("mainBox").style.height = null
        document.getElementById("listBox").style.height = null
    }

    if (window.innerWidth < 1091) {
        document.getElementById("serverInfo").style.opacity = "0.5"
    } else {
        document.getElementById("serverInfo").style.opacity = null
    }
}



// ----------------- Uploading system ----------------- //

// Handlers for hovering, dropping, etc - This functions are executed in the HTML
function handleFileSelect() {
    handleFile(document.getElementById("fileInput").files[0])
}
function handleDrop(event) {
    event.preventDefault()
    document.getElementById("listBox").style.backgroundImage = null
    handleFile(event.dataTransfer.files[0])
}
function handleDragOver(event) {
    event.preventDefault()
    document.getElementById("listBox").style.backgroundImage = "url(https://optijuegos.github.io/assets/download.svg)"
}
function handleDragLeave() {
    document.getElementById("listBox").style.backgroundImage = null
}

// Actually uploading the file
function handleFile(file) {
    document.getElementById("loading").style.display = null
    document.getElementById("loading").innerHTML = "Subiendo archivo..."

    reader = new FileReader()

    reader.onload = function() {
        const arrayBuffer = new Uint8Array(reader.result);

        const formData = new FormData();
        formData.append('files[]', new Blob([arrayBuffer]), file.name);

    fetch("https://up1.fileditch.com/upload.php", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
            if (data.success === true) {
                document.getElementById("loading").style.display = "none"

                // Creates the element
                entry.amount += 1
                let newElement = document.createElement("span")
                newElement.id = "e" + entry.amount
                newElement.className = "listEntry"
                newElement.innerHTML = file.name
                document.getElementById("entryContainer").appendChild(newElement)

                // Adds it to the elements list object
                elementsData["e" + entry.amount] = {
                    name: file.name,
                    link: data.files[0].url
                }

                selectEntry("e" + entry.amount)
                saveCookie()
            } else {
                document.getElementById("loading").innerHTML = "Ocurrió un error subiendo el archivo.<br>Revisa que sea un formato soportado u otros errores."
            }
    })
    }

    reader.readAsArrayBuffer(file)
}
function uploadFile() {
    document.getElementById("fileInput").click()
}


function ajnsdnjas() {
    
}