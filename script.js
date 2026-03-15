
let alters = JSON.parse(localStorage.getItem("alters")||"[]")
let frontHistory = JSON.parse(localStorage.getItem("frontHistory")||"[]")
let currentFront = JSON.parse(localStorage.getItem("currentFront")||"[]")
let statusText = localStorage.getItem("statusText")||""

let editIndex=null
let sortAZ=false

function save(){
localStorage.setItem("alters",JSON.stringify(alters))
localStorage.setItem("frontHistory",JSON.stringify(frontHistory))
localStorage.setItem("currentFront",JSON.stringify(currentFront))
}

function toggleTheme(){
document.body.classList.toggle("dark")
}

function toggleDashboard(){
let d=document.getElementById("dashboard")
d.style.display=d.style.display==="none"?"block":"none"
}

function toggleSort(){
sortAZ=!sortAZ
render()
}

function openAdd(){
editIndex=null
document.getElementById("formTitle").innerText="Add Alter"
document.getElementById("addModal").style.display="block"
}

function closeModal(){
document.querySelectorAll(".modal").forEach(m=>m.style.display="none")
}

function saveAlter(){

let file=document.getElementById("avatarInput").files[0]

let reader=new FileReader()

reader.onload=function(){

let alter={
name:document.getElementById("nameInput").value,
bio:document.getElementById("bioInput").value,
avatar:reader.result,
color:document.getElementById("colorInput").value,
group:document.getElementById("groupInput").value||"Ungrouped",
front:document.getElementById("frontPercent").value||0
}

if(editIndex!==null){
alters[editIndex]=alter
}else{
alters.push(alter)
}

save()
render()
closeModal()
}

if(file){
reader.readAsDataURL(file)
}else{
reader.onload()
}

}

function render(){

let list=[...alters]

if(sortAZ){
list.sort((a,b)=>a.name.localeCompare(b.name))
}

let container=document.getElementById("groupsContainer")
container.innerHTML=""

let grid=document.createElement("div")
grid.className="grid"

list.forEach((a,i)=>{

let card=document.createElement("div")
card.className="alterCard"
card.style.background=a.color+"cc"

let avatar=a.avatar?"<img class='avatar' src='"+a.avatar+"'>":""

card.innerHTML=avatar+a.name

card.onclick=()=>openAlter(i)

grid.appendChild(card)

})

container.appendChild(grid)

populateFrontSelect()
renderFront()

}

function openAlter(i){

let a=alters[i]
editIndex=i

document.getElementById("alterModal").style.display="block"

document.getElementById("modalName").innerText=a.name
document.getElementById("modalAvatar").src=a.avatar||""
document.getElementById("modalBio").innerHTML=marked.parse(a.bio||"")
document.getElementById("modalFront").innerText="Front %: "+a.front

}

function deleteAlter(){

if(editIndex===null)return

if(confirm("Delete alter?")){
alters.splice(editIndex,1)
save()
render()
closeModal()
}

}

function editAlter(){

let a=alters[editIndex]

document.getElementById("nameInput").value=a.name
document.getElementById("bioInput").value=a.bio
document.getElementById("colorInput").value=a.color
document.getElementById("groupInput").value=a.group
document.getElementById("frontPercent").value=a.front

document.getElementById("formTitle").innerText="Edit Alter"
document.getElementById("addModal").style.display="block"

}

function populateFrontSelect(){

let sel=document.getElementById("frontSelect")
sel.innerHTML=""

alters.forEach((a,i)=>{

let o=document.createElement("option")
o.value=i
o.textContent=a.name
sel.appendChild(o)

})

}

function addFront(){

let i=document.getElementById("frontSelect").value

currentFront=[alters[i].name]

frontHistory.push({
name:alters[i].name,
time:new Date().toLocaleString()
})

save()

renderFront()

}

function renderFront(){

document.getElementById("frontNow").innerText=currentFront.join(", ")

let h=""

frontHistory.slice(-10).reverse().forEach(f=>{

h+=f.time+" – "+f.name+"<br>"

})

document.getElementById("frontHistory").innerHTML=h

document.getElementById("statusText").innerText=statusText

}

function setStatus(){

statusText=document.getElementById("frontStatus").value

localStorage.setItem("statusText",statusText)

renderFront()

}

document.getElementById("searchBar").addEventListener("input",e=>{

let q=e.target.value.toLowerCase()

document.querySelectorAll(".alterCard").forEach(c=>{

c.style.display=c.innerText.toLowerCase().includes(q)?"block":"none"

})

})

function exportData(){

let blob=new Blob([JSON.stringify({alters,frontHistory})],{type:"application/json"})
let a=document.createElement("a")
a.href=URL.createObjectURL(blob)
a.download="system_backup.json"
a.click()

}

function importData(){

let input=document.createElement("input")
input.type="file"

input.onchange=e=>{

let reader=new FileReader()

reader.onload=function(){

let data=JSON.parse(reader.result)

alters=data.alters||[]
frontHistory=data.frontHistory||[]

save()
render()

}

reader.readAsText(e.target.files[0])

}

input.click()

}

render()
