"use strict";

// Chỉ số địa chi bắt đầu từ Tý = 0. Mọi phép dịch cung đều quay vòng 12.
const CHI = "Tý Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi".split(" ");
const CAN = "Giáp Ất Bính Đinh Mậu Kỷ Canh Tân Nhâm Quý".split(" ");
const CUNG = ["Mệnh","Phụ Mẫu","Phúc Đức","Điền Trạch","Quan Lộc","Nô Bộc","Thiên Di","Tật Ách","Tài Bạch","Tử Tức","Phu Thê","Huynh Đệ"];
const CHU_DE = ["bản thân và định hướng","cha mẹ và gia đình","nền nếp gia đình và đời sống tinh thần","nhà cửa và nơi ở","sự nghiệp và trách nhiệm","bạn bè và người cộng tác","môi trường bên ngoài và việc đi lại","sức khỏe và nếp sinh hoạt","thu nhập và chi tiêu","con cái và việc chăm sóc","quan hệ đôi lứa","anh chị em"];
const mod = (x,n=12) => ((x%n)+n)%n;
const stem = year => mod(year-4,10);
const branch = year => mod(year-4);
const canChi = year => CAN[stem(year)]+" "+CHI[branch(year)];
const rad = Math.PI/180;
const sin = degrees => Math.sin(degrees*rad);

// Lịch âm Việt Nam tính thiên văn theo UTC+7, dùng sóc thật và trung khí.
// Sóc Meeus (pha mới); JDE tính bằng ngày Julius theo giờ động lực.
function newMoon(k) {
  const t=k/1236.85, e=1-0.002516*t-0.0000074*t*t;
  const m=2.5534+29.10535670*k-0.0000014*t*t;
  const p=201.5643+385.81693528*k+0.0107582*t*t+0.00001238*t**3;
  const f=160.7108+390.67050284*k-0.0016118*t*t;
  const o=124.7746-1.56375588*k+0.0020672*t*t;
  const jde=2451550.09765+29.530588853*k+0.0001337*t*t-0.000000150*t**3;
  const correction=-0.40720*sin(p)+0.17241*e*sin(m)+0.01608*sin(2*p)+0.01039*sin(2*f)
    +0.00739*e*sin(p-m)-0.00514*e*sin(p+m)+0.00208*e*e*sin(2*m)-0.00111*sin(p-2*f)
    -0.00057*sin(p+2*f)+0.00056*e*sin(2*p+m)-0.00042*sin(3*p)+0.00042*e*sin(m+2*f)
    +0.00038*e*sin(m-2*f)-0.00024*e*sin(2*p-m)-0.00017*sin(o)-0.00007*sin(p+2*m)
    +0.00004*sin(2*p-2*f)+0.00004*sin(3*m)+0.00003*sin(p+m-2*f)+0.00003*sin(2*p+2*f)
    -0.00003*sin(p+m+2*f)+0.00003*sin(p-m+2*f)-0.00002*sin(p-m-2*f)-0.00002*sin(3*p+m)+0.00002*sin(4*p);
  const planetary=[[0.000325,299.77+0.107408*k-0.009173*t*t],[0.000165,251.88+0.016321*k],[0.000164,251.83+26.651886*k],[0.000126,349.42+36.412478*k],[0.000110,84.66+18.206239*k],[0.000062,141.74+53.303771*k],[0.000060,207.14+2.453732*k],[0.000056,154.84+7.30686*k],[0.000047,34.52+27.261239*k],[0.000042,207.19+0.121824*k],[0.000040,291.34+1.844379*k],[0.000037,161.72+24.198154*k],[0.000035,239.56+25.513099*k],[0.000023,331.55+3.592518*k]];
  const y=2000+k/12.3685;
  const u=y-2000;
  let dt;
  if(y<1920){const v=y-1900;dt=-2.79+1.494119*v-0.0598939*v*v+0.0061966*v**3-0.000197*v**4;}
  else if(y<1941){const v=y-1920;dt=21.20+0.84493*v-0.076100*v*v+0.0020936*v**3;}
  else if(y<1961){const v=y-1950;dt=29.07+0.407*v-v*v/233+v**3/2547;}
  else if(y<1986){const v=y-1975;dt=45.45+1.067*v-v*v/260-v**3/718;}
  else if(y<2005){dt=63.86+0.3345*u-0.060374*u*u+0.0017275*u**3+0.000651814*u**4+0.00002373599*u**5;}
  else if(y<2050){dt=62.92+0.32217*u+0.005589*u*u;}
  else {dt=-20+32*((y-1820)/100)**2-0.5628*(2150-y);}
  return Math.floor(jde+correction+planetary.reduce((s,[a,b])=>s+a*sin(b),0)-dt/86400+0.5+7/24);
}
function solarSector(day) {
  const t=(day-0.5-7/24-2451545)/36525;
  const m=357.52911+35999.05029*t-0.0001537*t*t;
  const longitude=280.46646+36000.76983*t+0.0003032*t*t+
    (1.914602-0.004817*t-0.000014*t*t)*sin(m)+(0.019993-0.000101*t)*sin(2*m)+0.000289*sin(3*m)-0.00569-0.00478*sin(125.04-1934.136*t);
  return Math.floor(mod(longitude,360)/30);
}
const julian = (y,m,d) => Date.UTC(y,m-1,d)/86400000+2440588;
function moonIndex(day) {
  let k=Math.floor((day-2451550)/29.530588853);
  while(newMoon(k)>day) k--;
  while(newMoon(k+1)<=day) k++;
  return k;
}
function winterMonth(year) {
  // Tháng 11 luôn chứa đông chí (kinh độ Mặt Trời 270 độ).
  const k=moonIndex(julian(year,12,31));
  return solarSector(newMoon(k))>=9?k-1:k;
}
function lunarDate(y,m,d) {
  const day=julian(y,m,d), k=moonIndex(day);
  const base=k<winterMonth(y)?y-1:y;
  const first=winterMonth(base), next=winterMonth(base+1);
  let offset=k-first, leap=false;
  if(next-first===13){
    let extra=1;
    while(extra<13 && solarSector(newMoon(first+extra))!==solarSector(newMoon(first+extra+1))) extra++;
    leap=offset===extra;
    if(offset>=extra) offset--;
  }
  return {day:day-newMoon(k)+1, month:1+mod(10+offset), year:base+(offset>=2?1:0),leap};
}

// Nạp âm theo thứ tự các cặp Giáp Tý/Ất Sửu ... Nhâm Tuất/Quý Hợi.
const NAP_AM=["Hải Trung Kim","Lư Trung Hỏa","Đại Lâm Mộc","Lộ Bàng Thổ","Kiếm Phong Kim","Sơn Đầu Hỏa","Giản Hạ Thủy","Thành Đầu Thổ","Bạch Lạp Kim","Dương Liễu Mộc","Tuyền Trung Thủy","Ốc Thượng Thổ","Tích Lịch Hỏa","Tùng Bách Mộc","Trường Lưu Thủy","Sa Trung Kim","Sơn Hạ Hỏa","Bình Địa Mộc","Bích Thượng Thổ","Kim Bạch Kim","Phú Đăng Hỏa","Thiên Hà Thủy","Đại Trạch Thổ","Thoa Xuyến Kim","Tang Đố Mộc","Đại Khê Thủy","Sa Trung Thổ","Thiên Thượng Hỏa","Thạch Lựu Mộc","Đại Hải Thủy"];
const CUC={Thủy:2,Mộc:3,Kim:4,Thổ:5,Hỏa:6};
const CUC_NAME=["","","Thủy nhị cục","Mộc tam cục","Kim tứ cục","Thổ ngũ cục","Hỏa lục cục"];
const LOC=[2,3,5,6,5,6,8,9,11,0];
function cycleIndex(can,chi){return mod(can+10*mod((can-chi)/2,6),60);}
function birthChart(lunar,hour,male){
  const {year,month,day}=lunar, can=stem(year), chi=branch(year);
  const menh=mod(2+month-1-hour), than=mod(2+month-1+hour);
  // Ngũ hổ độn: xác định can cung Dần, đếm thuận đến cung Mệnh.
  const palaceStem=mod(2*(can%5)+2+mod(menh-2),10);
  const element=NAP_AM[Math.floor(cycleIndex(palaceStem,menh)/2)].split(" ").pop();
  const cuc=CUC[element], direction=((can%2===0)===male)?1:-1;
  const houses=CHI.map((_,i)=>({index:i,kind:mod(i-menh),major:[],minor:[],start:cuc+10*mod((i-menh)*direction)}));
  const add=(i,s,group="minor")=>houses[mod(i)][group].push(s);
  // Bù ngày sinh đến bội số của cục. Số bù lẻ đi lùi, chẵn đi tới.
  const pad=mod(-day,cuc), tuVi=mod(2+(day+pad)/cuc-1+(pad%2?-pad:pad));
  const phu=mod(4-tuVi);
  [[0,"Tử Vi"],[-1,"Thiên Cơ"],[-3,"Thái Dương"],[-4,"Vũ Khúc"],[-5,"Thiên Đồng"],[-8,"Liêm Trinh"]].forEach(([i,s])=>add(tuVi+i,s,"major"));
  ["Thiên Phủ","Thái Âm","Tham Lang","Cự Môn","Thiên Tướng","Thiên Lương","Thất Sát"].forEach((s,i)=>add(phu+i,s,"major"));
  add(phu+10,"Phá Quân","major");
  add(LOC[can],"Lộc Tồn"); add(LOC[can]+1,"Kình Dương"); add(LOC[can]-1,"Đà La");
  add(4+month-1,"Tả Phù"); add(10-month+1,"Hữu Bật"); add(10-hour,"Văn Xương"); add(4+hour,"Văn Khúc");
  add(11-hour,"Địa Không"); add(11+hour,"Địa Kiếp");
  add([1,0,11,11,1,0,6,6,3,3][can],"Thiên Khôi"); add([7,8,9,9,7,8,2,2,5,5][can],"Thiên Việt");
  add([2,11,8,5][chi%4],"Thiên Mã"); add(3-chi,"Hồng Loan"); add(9-chi,"Thiên Hỷ");
  ["Thái Tuế","Thiếu Dương","Tang Môn","Thiếu Âm","Quan Phù","Tử Phù","Tuế Phá","Long Đức","Bạch Hổ","Phúc Đức","Điếu Khách","Trực Phù"].forEach((s,i)=>add(chi+i,s));
  return {lunar,hour,male,menh,than,cuc,direction,houses,napAm:NAP_AM[Math.floor(mod(year-1984,60)/2)]};
}
function fortune(chart,year,month){
  const age=year-chart.lunar.year+1, chi=branch(chart.lunar.year);
  const decade=chart.houses.find(h=>age>=h.start&&age<h.start+10);
  // Tiểu hạn: Thân Tý Thìn khởi Tuất, Tỵ Dậu Sửu khởi Mùi,
  // Dần Ngọ Tuất khởi Thìn, Hợi Mão Mùi khởi Sửu; nam thuận, nữ nghịch.
  const annual=mod([10,7,4,1][chi%4]+(chart.male?1:-1)*(age-1));
  const monthly=month?mod(annual-(chart.lunar.month-1)+chart.hour+month-1):null;
  const loc=LOC[stem(year)], moving=CHI.map(()=>[]);
  [[branch(year),"Lưu Thái Tuế"],[loc,"Lưu Lộc Tồn"],[loc+1,"Lưu Kình Dương"],[loc-1,"Lưu Đà La"]].forEach(([i,s])=>moving[mod(i)].push(s));
  return {age,decade,annual,monthly,moving};
}

// Phần giao diện tách khỏi các hàm tính toán để dễ kiểm thử, thay đổi trường phái.
function initUI(){
  const $=id=>document.getElementById(id);
  const el=(tag,cls,txt)=>{
    const node=document.createElement(tag);
    if(cls) node.className=cls;
    if(txt!==undefined) node.textContent=txt;
    return node;
  };
  const fmt=n=>String(n).padStart(2,"0");
  CHI.forEach((name,i)=>$("hour").add(new Option(name+" · "+fmt(mod(2*i-1,24))+":00–"+fmt(mod(2*i+1,24))+":00",i)));
  for(let m=1;m<=12;m++) $("month").add(new Option("Tháng "+m,m));
  $("hour").value=9;
  const now=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Ho_Chi_Minh",year:"numeric",month:"numeric",day:"numeric"}).formatToParts(new Date());
  const today=Object.fromEntries(now.map(x=>[x.type,+x.value]));
  $("year").value=lunarDate(today.year,today.month,today.day).year;
  let chart,person,selected,year,mode="birth";
  function submit(reset=true){
    if(!$("profile").reportValidity()) return false;
    const [y,m,d]=$("dob").value.split("-").map(Number);
    const lunar=lunarDate(y,m,d), target=+$("year").value;
    if(target<lunar.year){
      $("error").textContent="Năm xem hạn phải từ năm sinh âm lịch ("+lunar.year+") trở đi.";
      return false;
    }
    $("error").textContent="";
    const previous=chart;
    chart=birthChart(lunar,+$("hour").value,$("sex").value==="Nam");
    year=target;person=$("person").value.trim()||"Lá số khuyết danh";
    if(reset||!previous) selected=chart.menh;
    render();return true;
  }
  function render(){
    const f=fortune(chart,year,+$("month").value), natal=mode==="birth", monthly=mode==="monthly";
    document.querySelectorAll("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mode===mode));
    $("month").parentElement.hidden=!monthly;
    const board=$("board");board.replaceChildren();
    const c=el("section","center");
    const l=chart.lunar, yin=stem(l.year)%2?"Âm":"Dương";
    c.append(el("div","emblem","✧"),el("h3","",person),el("small","",l.day+"/"+l.month+(l.leap?" nhuận":"")+" âm lịch · Giờ "+CHI[chart.hour]));
    const facts=el("dl");
    for(const [k,v] of [["Năm sinh",canChi(l.year)],["Âm dương",yin+" "+(chart.male?"nam":"nữ")],["Bản mệnh",chart.napAm],["Ngũ hành cục",CUC_NAME[chart.cuc]],["Thân cư",CUNG[chart.houses[chart.than].kind]]]){
      const row=el("div");row.append(el("dt","",k),el("dd","",v));facts.append(row);
    }
    c.append(facts);board.append(c);
    const pos=[[4,3],[4,2],[4,1],[3,1],[2,1],[1,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4]];
    chart.houses.forEach((h,i)=>{
      const btn=el("button","house"+(i===selected?" selected":""));btn.type="button";
      btn.style.gridRow=pos[i][0];btn.style.gridColumn=pos[i][1];btn.setAttribute("aria-pressed",i===selected);
      const meta=el("span","meta");meta.append(el("span","",CHI[i]),el("span","",h.start+" tuổi"));
      const marks=[];
      if(i===chart.than) marks.push("Thân");
      if(!natal&&i===f.decade?.index) marks.push("Đại hạn");
      if(!natal&&i===f.annual) marks.push("Tiểu hạn");
      if(monthly&&i===f.monthly) marks.push("Nguyệt hạn");
      btn.append(meta,el("strong","",CUNG[h.kind]),el("span","major",h.major.join(" · ")||"Vô chính diệu"),el("span","minor",h.minor.join(" · ")));
      if(!natal&&f.moving[i].length)btn.append(el("span","flow",f.moving[i].join(" · ")));
      if(marks.length)btn.append(el("span","mark",marks.join(" · ")));
      btn.onclick=()=>{
        selected=i;
        board.querySelectorAll(".house").forEach(b=>{b.classList.toggle("selected",b===btn);b.setAttribute("aria-pressed",b===btn);});
        renderDetail(f);
      };
      board.append(btn);
    });
    const panel=$("period");panel.replaceChildren();
    const where=i=>"cung "+CUNG[chart.houses[i].kind]+" ("+CHI[i]+")";
    if(natal){
      panel.append(el("h3","","Tổng quan lá số"),el("p","","Mệnh an tại "+CHI[chart.menh]+". Thân cư "+CUNG[chart.houses[chart.than].kind]+"."),
      el("p","","Đại hạn đầu từ "+chart.cuc+" đến "+(chart.cuc+9)+" tuổi mụ, đi "+(chart.direction===1?"thuận":"nghịch")+" qua các cung."));
    }else{
      panel.append(el("h3","","Vận năm "+year),el("p","",canChi(year)+" · "+f.age+" tuổi mụ"),
      el("p","",f.decade?"Đại hạn "+f.decade.start+"–"+(f.decade.start+9)+" tuổi tại "+where(f.decade.index)+".":f.age<chart.cuc?"Chưa vào đại hạn đầu.":"Đã qua 12 đại hạn của bàn số."),
      el("p","","Tiểu hạn tại "+where(f.annual)+", ứng với chủ đề "+CHU_DE[chart.houses[f.annual].kind]+"."));
      if(monthly) panel.append(el("p","flow","Tháng "+$("month").value+" âm lịch đi vào "+where(f.monthly)+". Trọng tâm tháng là "+CHU_DE[chart.houses[f.monthly].kind]+"."));
    }
    renderDetail(f);
  }
  function renderDetail(f){
    const h=chart.houses[selected],panel=$("detail");
    panel.replaceChildren(el("h3","","Cung "+CUNG[h.kind]),el("p","","Cung đóng tại "+CHI[selected]+", chủ về "+CHU_DE[h.kind]+"."),
    el("p","major",h.major.length?"Chính tinh: "+h.major.join(", "):"Vô chính diệu · Xét thêm chính tinh tại đối cung "+CHI[mod(selected+6)]+": "+chart.houses[mod(selected+6)].major.join(", ")+"."),
    el("p","","Phụ tinh: "+(h.minor.join(", ")||"Không có trong nhóm sao cơ bản")+"."));
    if(mode!=="birth"){
      const meanings={"Lưu Thái Tuế":"chủ đề nổi bật của năm","Lưu Lộc Tồn":"nguồn lực và sự tích lũy","Lưu Kình Dương":"va chạm hoặc sức ép","Lưu Đà La":"việc trì hoãn, cần kiên nhẫn"};
      const flow=f.moving[selected];
      panel.append(el("p","flow",flow.length?flow.map(s=>s+" — "+meanings[s]).join(". ")+".":"Năm "+year+" không có sao lưu trong nhóm đang xét tại cung này."));
    }
  }
  $("profile").onsubmit=e=>{e.preventDefault();submit();};
  $("year").onchange=()=>{const old=mode;if(mode==="birth") mode="annual";if(!submit(false)) mode=old;};
  document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{
    const old=mode;mode=b.dataset.mode;if(!submit(false))mode=old;
  });
  $("month").onchange=()=>submit(false);
  drawDial();submit();
}
// Hoa văn thiên bàn: vòng chia độ và 12 địa chi, vẽ trực tiếp bằng Canvas.
function drawDial(){
  const ctx=document.getElementById("dial").getContext("2d");
  if(!ctx)return;
  ctx.translate(310,310);ctx.scale(2,2);ctx.strokeStyle="#bfac79";ctx.fillStyle="#dac593";ctx.globalAlpha=.75;
  for(const radius of [48,65,80,107,111,132,145]){
    ctx.lineWidth=.65;ctx.beginPath();ctx.arc(0,0,radius,0,2*Math.PI);ctx.stroke();
  }
  for(let i=0;i<120;i++){
    ctx.save();ctx.rotate(i*Math.PI/60);ctx.beginPath();ctx.moveTo(0,-132);ctx.lineTo(0,i%10===0?-110:i%5===0?-122:-128);ctx.stroke();ctx.restore();
  }
  CHI.forEach((name,i)=>{
    const a=i*Math.PI/6-Math.PI/2;ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="11px Georgia";
    ctx.fillText(name,95*Math.cos(a),95*Math.sin(a));
    ctx.save();ctx.rotate(a);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(57,0);ctx.lineTo(24,10);ctx.closePath();ctx.stroke();ctx.restore();
  });
}
if(typeof document!=="undefined")initUI();
