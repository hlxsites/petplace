import{j as e,B as s,T as n,u as f}from"./react-index.js";const y=()=>e.jsxs(e.Fragment,{children:[e.jsx(s,{variant:"primary",children:"Primary button"}),e.jsx(s,{variant:"secondary",children:"Secondary button"})]}),h=()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{children:"A default text"}),e.jsx(n,{fontFamily:"raleway",children:"Raleway font-family text"}),e.jsx(n,{fontWeight:"bold",children:"Text with bold weight"})]}),o=Object.freeze(Object.defineProperty({__proto__:null,ButtonPlayground:y,TextPlayground:h},Symbol.toStringTag,{value:"Module"})),r=Object.keys(o),l="display",j=()=>{const[c,d]=f(),a=c.get(l)??r[0],i=o[a];return e.jsxs("div",{className:"flex w-full",children:[e.jsx("div",{className:"flex w-[200px] flex-col gap-base p-small",children:r.map(u)}),e.jsx("div",{className:"flex min-h-full w-full flex-col gap-base p-base",children:e.jsx(i,{})})]});function u(t){const m=t===a;return e.jsx(s,{className:"text-sm",fullWidth:!0,onClick:x(t),variant:m?"primary":"secondary",children:t.replace("Playground","")},t)}function x(t){return()=>{d({[l]:t})}}};export{j as default};