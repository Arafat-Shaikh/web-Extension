const allColors = document.querySelector(".all-colors");
const clearBtn = document.querySelector(".clear-btn");
const exportBtn = document.querySelector(".export-btn");
const pickColor = document.querySelector(".pick-btn");



let storedColor = JSON.parse(localStorage.getItem("colorVal")) || [];
let openedPopup = null;

const showPopup = (color)=>{
  const popupEl = document.createElement("div");
  popupEl.classList.add("popup-container");
  popupEl.innerHTML = 
    `
        <span style="background-color: ${color}" class="popupColorBox"></span>

        <div class="hexAndRgb">
            <div class="crossBox">
                <div class="HexBox">
                    <span>Hex : </span>
                    <span>${color}</span>
                </div>
                <span class="cross">x</span>
            </div>
           
            <div class="rgbBox">
                <span>RGB : </span>
                <span>${hexToRgb(color)}</span>
            </div>
        </div>
    `
        
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
                console.log(openedPopup);
            

        })
    })
}

showColors();
    

const activateColorPicker = async () =>{
    document.body.style.display = "none";
    try{
        let {sRGBHex} = await new EyeDropper().open();
        console.log(sRGBHex);
        if(!(storedColor.includes(sRGBHex))){
            storedColor.push(sRGBHex);
            localStorage.setItem("colorVal",JSON.stringify(storedColor));
        }
        showColors();

    }
    catch(error){
        console.log(error.name);
        console.log(error.message);
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
   



pickColor.addEventListener("click",()=>{
    activateColorPicker();
})

clearBtn.addEventListener("click",()=>{
    localStorage.clear("colorVal")
    storedColor = [];
    openedPopup = null;
})