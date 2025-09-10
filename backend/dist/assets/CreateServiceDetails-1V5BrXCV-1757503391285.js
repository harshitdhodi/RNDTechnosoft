import{f as _,r as n,d as H,j as e,Q as L,e as x,B as F,a as O}from"./index-y7nyBnkY-1757503391285.js";const z=()=>{const{categoryId:Q}=_(),[g,f]=n.useState(""),[v,j]=n.useState(""),[i,h]=n.useState([]),[r,c]=n.useState([]),[d,m]=n.useState([]),[p,N]=n.useState(null),[y,w]=n.useState(""),[q,k]=n.useState(""),[C,A]=n.useState(!0),[a,u]=n.useState([{question:"",answer:""}]),V=H(),b={toolbar:[[{font:[]}],["bold","italic","underline","strike","blockquote"],[{header:[1,2,3,4,5,6,!1]}],[{list:"ordered"},{list:"bullet"},{list:"check"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],["link","image","video"],[{direction:"rtl"}],[{color:[]},{background:[]}],[{align:[]}],["clean"]],clipboard:{matchVisual:!1}},D=s=>{const t=Array.from(s.target.files);if(i.length+t.length>5){F.error("You can only upload up to 5 photos");return}h([...i,...t]);const l=Array.from({length:t.length},()=>"");c([...r,...l]);const o=Array.from({length:t.length},()=>"");m([...d,...o])},E=s=>{N(s.target.files[0])},I=s=>{h(t=>t.filter((l,o)=>o!==s)),c(t=>t.filter((l,o)=>o!==s)),m(t=>t.filter((l,o)=>o!==s))},S=(s,t)=>{const l=[...a];l[s][t.target.name]=t.target.value,u(l)},P=()=>{u([...a,{question:"",answer:""}])},R=s=>{u(a.filter((t,l)=>l!==s))},T=async s=>{s.preventDefault();try{const t=new FormData;t.append("heading",g),t.append("description",v),t.append("status",C),t.append("altVideo",y),t.append("categoryId",Q),t.append("videotitle",q),i.forEach((l,o)=>{t.append("photo",l),t.append("alt",r[o]),t.append("imgtitle",d[o])}),p&&t.append("video",p),a.forEach(l=>{t.append("questions",JSON.stringify(l))}),await O.post("/api/serviceDetails/insertServiceDetail",t,{headers:{"Content-Type":"multipart/form-data"},withCredentials:!0}),j(""),f(""),h([]),N(null),w(""),A(!0),c([]),m([]),k(""),u([{question:"",answer:""}]),V("/services")}catch(t){console.error(t),F.error("Failed to create service.")}};return e.jsxs("form",{onSubmit:T,className:"p-4",children:[e.jsx(L,{}),e.jsx("h1",{className:"text-xl font-bold font-serif text-gray-700 uppercase text-center",children:"Add Service"}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{htmlFor:"heading",className:"block font-semibold mb-2",children:"Heading"}),e.jsx(x,{value:g,onChange:f,modules:b,placeholder:"Enter heading here...",className:"quill-editor"}),e.jsx("style",{jsx:!0,global:!0,children:`
          .quill-editor .ql-editor {
            min-height: 100px;
            padding-bottom: 1.5rem;
            padding-top: 0.5rem;
          }
          .quill-editor .ql-editor.ql-blank::before {
            color: #6b7280;
            font-style: normal;
            left: 15px;
            right: 15px;
            top: 0.75rem;
            pointer-events: none;
          }
        `})]}),e.jsxs("div",{className:"mb-8",children:[e.jsx("label",{htmlFor:"description",className:"block font-semibold mb-2",children:"Description"}),e.jsx(x,{value:v,onChange:j,modules:b,placeholder:"Enter description here...",className:"quill-editor"}),e.jsx("style",{jsx:!0,global:!0,children:`
          .quill-editor .ql-editor {
            min-height: 100px;
            padding-bottom: 1.5rem;
            padding-top: 0.5rem;
          }
          .quill-editor .ql-editor.ql-blank::before {
            color: #6b7280;
            font-style: normal;
            left: 15px;
            right: 15px;
            top: 0.75rem;
            pointer-events: none;
          }
        `})]}),e.jsxs("div",{className:"mt-12",children:[e.jsx("label",{htmlFor:"photo",className:"block font-semibold mb-2",children:"Photos"}),e.jsx("input",{type:"file",name:"photo",id:"photo",multiple:!0,onChange:D,className:"border rounded focus:outline-none",accept:"image/*"}),i.length>0&&e.jsx("div",{className:"mt-2 flex flex-wrap gap-4",children:i.map((s,t)=>e.jsxs("div",{className:"relative group flex flex-col items-center w-56",children:[e.jsxs("div",{className:"relative w-56",children:[e.jsx("img",{src:URL.createObjectURL(s),alt:`Service ${t+1}`,className:"w-56 h-32 object-cover"}),e.jsx("button",{onClick:()=>I(t),className:"absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none",children:"X"})]}),e.jsxs("label",{className:"block mt-2",children:["Alternative Text:",e.jsx("input",{type:"text",value:r[t],onChange:l=>{const o=[...r];o[t]=l.target.value,c(o)},className:"w-full p-2 border rounded focus:outline-none"})]}),e.jsxs("label",{className:"block mt-2",children:["Image title Text:",e.jsx("input",{type:"text",value:d[t],onChange:l=>{const o=[...d];o[t]=l.target.value,m(o)},className:"w-full p-2 border rounded focus:outline-none"})]})]},t))})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{htmlFor:"video",className:"block font-semibold mb-2",children:"Video"}),e.jsx("input",{type:"file",id:"video",onChange:E,className:"border rounded focus:outline-none",accept:"video/*"}),p&&e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{htmlFor:"videoAlt",className:"block font-semibold mb-2",children:"Video Alt Text"}),e.jsx("input",{type:"text",id:"videoAlt",value:y,onChange:s=>w(s.target.value),className:"w-full p-2 border rounded focus:outline-none",required:!0}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{htmlFor:"videotitle",className:"block font-semibold mb-2",children:"Video title Text"}),e.jsx("input",{type:"text",id:"videotitle",value:q,onChange:s=>k(s.target.value),className:"w-full p-2 border rounded focus:outline-none",required:!0})]})]})]}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Questions and Answers"}),a.map((s,t)=>e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block mb-1 font-medium",children:"Question"}),e.jsx("input",{type:"text",name:"question",value:s.question,onChange:l=>S(t,l),className:"w-full p-2 border rounded focus:outline-none mb-2"}),e.jsx("label",{className:"block mb-1 font-medium",children:"Answer"}),e.jsx(x,{value:s.answer,onChange:l=>S(t,l),modules:b,placeholder:"Enter answer here...",className:"quill-editor"}),e.jsx("style",{jsx:!0,global:!0,children:`
              .quill-editor .ql-editor {
                min-height: 100px;
                padding-bottom: 1.5rem;
                padding-top: 0.5rem;
              }
              .quill-editor .ql-editor.ql-blank::before {
                color: #6b7280;
                font-style: normal;
                left: 15px;
                right: 15px;
                top: 0.75rem;
                pointer-events: none;
              }
            `}),a.length>1&&e.jsx("button",{type:"button",className:"mt-2 text-red-600",onClick:()=>R(t),children:"Remove"})]},t)),e.jsx("button",{type:"button",className:"mt-4 bg-blue-500 text-white px-4 py-2 rounded",onClick:P,children:"Add Another Question"})]}),e.jsx("div",{className:"mt-8",children:e.jsxs("label",{htmlFor:"status",className:"inline-flex items-center",children:[e.jsx("input",{type:"checkbox",id:"status",checked:C,onChange:s=>A(s.target.checked),className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsx("span",{className:"ml-2 font-medium",children:"Active"})]})}),e.jsx("div",{className:"mt-8",children:e.jsx("button",{type:"submit",className:"bg-green-500 text-white px-4 py-2 rounded",children:"Create Service"})})]})};export{z as default};
