document.getElementById("loading").innerHTML = "Ejecutando JavaScript...<br>Cargando elements.json..."
fetch("elements.json")
    .then(response => {
    if (!response.ok) {
        document.getElementById("loading").innerHTML = "Ejecutando JavaScript...<br>Cargando elements.json...<br>Falló al cargar elements.json"
    }
    return response.json()
    }
    )
    .then(
        data => {
        elementsData = data
        document.getElementById("header").style.display = "block"
        document.getElementById("mainContainer").style.display = "block"
        informationData = {}
        main()
    }
)

// This is the only way I found to make it so the code wouldn't execute until the JSON file was loaded
// I don't know if it's efficient, but it's definitely easy and doesn't make the code any more complex
function main() {

// ----------------- Downloading further info ----------------- //

document.getElementById("loading").innerHTML = "Ejecutando JavaScript...<br>Cargando elements.json...<br>Cargando information.json..."
fetch("information.json")
.then(response => {
    if (!response.ok) {
        document.getElementById("loading").innerHTML = "Ejecutando JavaScript...<br>Cargando elements.json...<br>Cargando information.json...<br>Falló al cargar information.json"
        setTimeout(function(){document.getElementById("loading").style.opacity = "0"}, 3000)
        setTimeout(function(){document.getElementById("loading").style.display = "none"}, 4000)
    }
    return response.json()
    }
    )
    .then(data => {
        informationData = data
        document.getElementById("loading").style.display = "none"
        updateButtons()
    }
)

// ------------------------ Defaults ------------------------ //

tab = {}
tab.selected = "t4"
entry = {}
infoMenuOpen = false

document.getElementById("entryContainer").scrollTo({top: 0})


// ------------------------ Tabs ------------------------ //

tab.amount = Object.keys(elementsData).length

// Creates the tabs themselves with the info of the JSON
for (let i = 1; i <= tab.amount; i++) {
    let newElement = document.createElement("a")
    newElement.id = "t" + i
    newElement.className = "tabButton"
    newElement.innerHTML = elementsData["t" + i].title
    document.getElementById("tabContainer").appendChild(newElement)
}

// Expands the tab container width depending how many tabs there are
document.getElementById("tabContainer").style.width = tab.amount * 140 + "px"

// Event listeners to change tabs
document.getElementById("tabContainer").addEventListener("mousedown", function(event) {
    if (event.button === 0 && event.target.getAttribute("id") !== "tabContainer") {
        changeTab(event.target.getAttribute("id"))
    }
})

changeTab(tab.selected)


// ------------------------ Entries ------------------------ //

// Event listeners to change entry selection
document.getElementById("entryContainer").addEventListener("mousedown", function(event) {
    if (event.button === 0 && event.target.getAttribute("id") !== "entryContainer") {
        selectEntry(event.target.getAttribute("id"))
    }
})

// Event listeners to show the information of the selected entry
document.getElementById("info").addEventListener("mousedown", function(event) {
    if (event.button === 0) {
        infoMenu()
    }
})

selectEntry(entry.selected)



// ------------------------ Keyboard navigation ------------------------ //
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey) {
        switch (event.code) {
            case "ArrowUp":
                if (entry.selectedInt > 1) {
                    entry.selectedInt -= 1
                    selectEntry("e" + entry.selectedInt, true)
                }
                break;
            case "ArrowDown":
                if (entry.selectedInt < entry.amount) {
                    entry.selectedInt += 1
                    selectEntry("e" + entry.selectedInt, true)
                }
                break;
            case "ArrowRight":
                if (tab.selectedInt < tab.amount) {
                    tab.selectedInt += 1
                    changeTab("t" + tab.selectedInt)
                }
                break;
            case "ArrowLeft":
                if (tab.selectedInt > 1) {
                    tab.selectedInt -= 1
                    changeTab("t" + tab.selectedInt)
                }
                break;
        }
    }
    if (event.altKey) {
        switch (event.code) {
            case "ArrowUp":
                if (tab.selectedInt > 1) {
                    tab.selectedInt -= 1
                    changeTab("t" + tab.selectedInt)
                }
                break;
            case "ArrowDown":
                if (tab.selectedInt < tab.amount) {
                    tab.selectedInt += 1
                    changeTab("t" + tab.selectedInt)
                }
                break;
        }
    }

    // I had to put this outside the Switch statement
    if (event.ctrlKey && event.key === "Enter") {
        if (elementsData[tab.selected][entry.selected].l2 !== undefined) {
            window.location.href = elementsData[tab.selected][entry.selected].l2
        }
    } else if (event.code === "Enter") {
        window.location.href = elementsData[tab.selected][entry.selected].l1
    }

    if (event.code === "Backspace") {
        if (document.getElementById("info").style.opacity !== "0") {
            infoMenu()
        }
    }
})

// Change tab
function changeTab(id) {
    // Scrolls back to top
    if (tab.selected !== id) {
        document.getElementById("entryContainer").scrollTo({top: 0})
    }

    // Styling of the tab buttons
    document.getElementById(tab.selected).style.backgroundColor = null
    document.getElementById(tab.selected).style.boxShadow = null
    document.getElementById(tab.selected).style.cursor = null
    tab.selected = id
    document.getElementById(tab.selected).style.backgroundColor = "#FFFFFF12"
    document.getElementById(tab.selected).style.boxShadow = "inset 0 0 0 3px #FFFFFF12"
    document.getElementById(tab.selected).style.cursor = "default"

    // This is used for keyboard navigation
    tab.selectedInt = parseInt(tab.selected.slice(1))

    // Label/Subtitle of tab
    document.getElementById("tabSubtitle").innerHTML = elementsData[tab.selected].subtitle

    // Hide/Unhide server list
    if (tab.selected === "t4") {
        document.getElementById("serverInfo").style.display = "block"
    } else {
        document.getElementById("serverInfo").style.display = "none"
    }

    infoMenuOpen = true
    infoMenu()

    updateEntries()
    entry.selected = "e1"
    selectEntry("e1")
}


// Update entries
function updateEntries() {
    // Deletes old entries
    document.getElementById("entryContainer").textContent = ""

    // Creates the new ones
    entry.amount = Object.keys(elementsData[tab.selected]).length - 2

    for (let i = 1; i <= entry.amount; i++) {
        let newElement = document.createElement("span")
        newElement.id = "e" + i
        newElement.className = "listEntry"
        newElement.innerHTML = elementsData[tab.selected]["e" + i].name
        document.getElementById("entryContainer").appendChild(newElement)
    }
}


// Change selected entry
function selectEntry(id, keyboardNavigation) {
    document.getElementById(entry.selected).style = null
    entry.selected = id
    document.getElementById(entry.selected).style.backgroundColor = "#FFFFFF17"

    // This is used for keyboard navigation
    entry.selectedInt = parseInt(entry.selected.slice(1))

    if (keyboardNavigation) {
        if (entry.selectedInt > 1) {
            document.getElementById(entry.selected).scrollIntoView({block: "center", behavior: "smooth"})
        } else {
            document.getElementById("entryContainer").scrollTo({top: 0, behavior: "smooth"})
        }
    }

    updateButtons()
}



// Update buttons label and links
function updateButtons() {
    // Change button links
    document.getElementById("download1").setAttribute("href", elementsData[tab.selected][entry.selected].l1)
    document.getElementById("download1").innerHTML = elementsData[tab.selected][entry.selected].b1

    // Checks if the first button has specified text in the JSON, and if not, sets a generic "Descargar" label
    if (elementsData[tab.selected][entry.selected].b1 === undefined) {
        document.getElementById("download1").innerHTML = "Descargar"
    } else {
        document.getElementById("download1").innerHTML = elementsData[tab.selected][entry.selected].b1
    }

    // Checks if there is extra information from information.json, and if so, it enables the information button
    if (informationData[tab.selected] === undefined) {
        document.getElementById("info").style.opacity = "0"
        fullButtonWidth = "408px"
        splitButtonWidth = "196px"
        document.getElementById("download2").style.left = "0px"
    } else if (informationData[tab.selected][entry.selected] === undefined) {
        document.getElementById("info").style.opacity = "0"
        fullButtonWidth = "408px"
        splitButtonWidth = "196px"
        document.getElementById("download2").style.left = "0px"
    } else {
        document.getElementById("info").style.opacity = null
        fullButtonWidth = "356px"
        splitButtonWidth = "170px"
        document.getElementById("download2").style.left = "52px"
    }

    // Checks if there is a second link, and if so, it enables the second button
    if (elementsData[tab.selected][entry.selected].l2 === undefined) {
        document.getElementById("download1").style.width = fullButtonWidth
        document.getElementById("download2").removeAttribute("href")
        document.getElementById("download2").style.opacity = "0"
    } else {
        document.getElementById("download2").style.display = null
        document.getElementById("download1").style.width = splitButtonWidth
        document.getElementById("download2").style.width = splitButtonWidth
        document.getElementById("download2").setAttribute("href", elementsData[tab.selected][entry.selected].l2)
        document.getElementById("download2").innerHTML = elementsData[tab.selected][entry.selected].b2
        document.getElementById("download2").style.opacity = null
    }
}


// Open Information/Help menu
function infoMenu() {
    if (infoMenuOpen) {
        infoMenuOpen = false
        document.getElementById("entryContainer").style.display = null
        document.getElementById("textContainer").style.display = null
        document.getElementById("info").style.backgroundImage = null
        document.getElementById("listIcon").src = "assets/list.svg"
        document.getElementById("tabSubtitle").innerHTML = elementsData[tab.selected].subtitle
    } else {
        infoMenuOpen = true
        document.getElementById("entryContainer").style.display = "none"
        document.getElementById("textContainer").style.display = "block"
        document.getElementById("listIcon").src = "assets/text.svg"
        document.getElementById("info").style.backgroundImage = "url(assets/back.svg)"
        document.getElementById("tabSubtitle").innerHTML = "Información: " + elementsData[tab.selected][entry.selected].name
        document.getElementById("textContainer").innerHTML = informationData[tab.selected][entry.selected]
    }
}



// Enable/disable compact mode
function compactMode() {
    if (window.innerHeight < 721 || window.innerWidth - 580 < tab.amount * 140) {
        document.getElementById("header").style.borderBottom = "none"
        document.getElementById("header").style.borderRight = "2px solid #00000040"
        document.getElementById("header").style.width = "296px"
        document.getElementById("header").style.height = "100%"
        document.getElementById("tabContainer").style.display = "block"
        document.getElementById("tabContainer").style.left = "59px"
        document.getElementById("tabContainer").style.transform = "none"
        document.getElementById("tabContainer").style.marginTop = "96px"
        document.getElementById("mainContainer").style.left = "calc(50% + 149px)"
        document.getElementById("socialContainer").style.right = "auto"
        document.getElementById("socialContainer").style.top = "auto"
        document.getElementById("socialContainer").style.bottom = "20px"
        document.getElementById("socialContainer").style.left = "64px"
        
        // This changes a CSS variable which is used for the tab buttons
        document.documentElement.style.setProperty("--tabWidth", "180px")
    } else {
        document.getElementById("header").style = null
        document.getElementById("tabContainer").style = null
        document.getElementById("tabContainer").style.width = tab.amount * 140 + "px"
        document.getElementById("mainContainer").style.left = null
        document.getElementById("socialContainer").style = null
        document.documentElement.style.setProperty("--tabWidth", "180px")
    }

    if (window.innerHeight < 575) {
        document.getElementById("mainContainer").style.height = window.innerHeight + "px"
        document.getElementById("serverInfo").style.height = window.innerHeight - 450 + "px"
        document.getElementById("mainBox").style.height = window.innerHeight - 124 + "px"
        document.getElementById("listBox").style.height = window.innerHeight - 194 + "px"
    } else {
        document.getElementById("mainContainer").style.height = null
        document.getElementById("mainBox").style.height = null
        document.getElementById("listBox").style.height = null
    }
}

compactMode()
}
