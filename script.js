const allColors = document.querySelector(".all-colors");
const clearBtn = document.querySelector(".clear-btn");
const exportBtn = document.querySelector(".export-btn");
const pickColor = document.querySelector(".pick-btn");



let storedColor = JSON.parse(localStorage.getItem("colorVal")) || [];
let openedPopup = null;


const showPopup = (color)=>{
  const popupEl = document.createElement("div");
  popupEl.classList.add("popup-container");
  popupEl.innerHTML = `
        <div class="popup-content">
            <span class="cross">x</span>
            <div class="color-info">
                <div class="color-box" style="background: ${color};"></div>
                <div class="color-details">
                    <div class="color-value">
                        <span class="label">Hex:</span>
                        <span class="val hex" data-color="${color}">${color}</span>
                    </div>
                    <div class="color-value">
                        <span class="label">RGB:</span>
                        <span class="val rgb" data-color="${color}">${hexToRgb(color)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    
        const crossBtn = popupEl.querySelector(".cross");
        crossBtn.addEventListener("click",()=>{
            document.body.removeChild(openedPopup);
            openedPopup = null;
        })

        const colorval = popupEl.querySelectorAll(".val");
        colorval.forEach((btn)=>{
            btn.addEventListener("click",(e)=>{
                const text = e.currentTarget.innerText;
                copyToClipBoard(text,e.currentTarget);
            })
        })
    
    
    return popupEl;           

}

const showColors = ()=>{
    allColors.innerHTML = storedColor.map(color =>
        `<li class=color>
            <span class=box style="background-color: ${color}; border: 1px solid ${color == "#ffffff"? "#ccc": color}" ></span>
            <span class="val hex" data-color="${color}">${color}</span>
        </li>`
    ).join("")

    const colorBox = document.querySelectorAll(".color");
    colorBox.forEach((li)=>{
        const colorHex = li.querySelector(".val.hex");
        colorHex.addEventListener("click",(e)=>{
            let color = e.currentTarget.dataset.color;
            if(openedPopup){
                document.body.removeChild(openedPopup);
            }
                const popup = showPopup(color);
                document.body.appendChild(popup);
                openedPopup = popup;            

        })
    })

    const colorList = document.querySelector(".color-list");
    colorList.classList.toggle("hide",storedColor.length === 0);
}

    

const activateColorPicker = async () =>{
    document.body.style.display = "none";
    try{
        let {sRGBHex} = await new EyeDropper().open();
        if(!(storedColor.includes(sRGBHex))){
            storedColor.push(sRGBHex);
            localStorage.setItem("colorVal",JSON.stringify(storedColor));
        }
        showColors();

    }
    catch(error){
        alert("Failed to pick color");
    }
    finally{
        document.body.style.display = "block"
    }
}

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
};
   
const copyToClipBoard = async (text,element) =>{
    try{
        await navigator.clipboard.writeText(text);
        element.innerHTML = "Copied";

        setTimeout(()=>{
            element.innerText = text;
        },1000)
    }catch(err){
        alert("Failed to copy text");
    }

}

const exportFile = () =>{
    const stringColors = storedColor.join("/n");
    const blobObject = new Blob([stringColors],{type: "text/plain"});
    const url = URL.createObjectURL(blobObject);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Color.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

}


pickColor.addEventListener("click",activateColorPicker);
exportBtn.addEventListener("click",exportFile);


clearBtn.addEventListener("click",()=>{
    localStorage.removeItem("colorVal")
    storedColor = [];
    showColors();
})

showColors();
