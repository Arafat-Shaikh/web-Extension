const allColors = document.querySelector(".all-colors");
const clearBtn = document.querySelector(".clear-btn");
const exportBtn = document.querySelector(".export-btn");
const pickColor = document.querySelector(".pick-btn");



let storedColor = JSON.parse(localStorage.getItem("colorVal")) || []
const activateColorPicker = async ()=>{
    try{
        let {sRGBHex} = await new EyeDropper().open();
        
        if(!(storedColor.includes(sRGBHex))){
            
        }

    }
    catch(error){
        console.log(error)
    }
  
    
}

pickColor.addEventListener("click",()=>{
    activateColorPicker();
})