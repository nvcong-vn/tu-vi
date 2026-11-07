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
// Bảng độ sáng chính tinh theo Tử Vi Thiên Cơ. Thứ tự nhóm: miếu, vượng, đắc, hãm.
// Các chi còn lại thuộc mức bình. Chỉ số 0 = Tý, 11 = Hợi.
const BRIGHT={
 "Tử Vi":[[2,5,6,8],[4,10],[1,7],[]],
 "Thiên Cơ":[[3,4,9,10],[5,8],[0,1,6,7],[2,11]],
 "Thái Dương":[[5,6],[2,3,4],[1,7],[0,8,9,10,11]],
 "Vũ Khúc":[[1,4,7,10],[0,2,6,8],[3,9],[5,11]],
 "Thiên Đồng":[[2,8],[0],[3,5,11],[1,4,6,7,9,10]],
 "Liêm Trinh":[[0,2,6,8],[],[],[3,5,9,11]],
 "Thiên Phủ":[[0,1,2,7],[3,4,6,10],[],[]],
 "Thái Âm":[[9,10,11],[0,8],[1,7],[2,3,4,5,6]],
 "Tham Lang":[[1,7],[4,10],[2,8],[0,3,5,6,9,11]],
 "Cự Môn":[[2,3,8,9],[0,6,11],[],[1,4,5,7,10]],
 "Thiên Tướng":[[2,8],[0,4,6,10],[1,5,7,11],[3,9]],
 "Thiên Lương":[[4,6,10],[0,1,2,3,7,8],[],[5,9,11]],
 "Thất Sát":[[0,2,6,8],[5,11],[1,7],[3,4,9,10]],
 "Phá Quân":[[0,6],[1,4,7,10],[],[2,3,5,8,9,11]]
};
function majorText(h){
  return h.major.map(s=>s+" ("+(["miếu","vượng","đắc","hãm"][BRIGHT[s].findIndex(g=>g.includes(h.index))]||"bình")+")").join(", ");
}
// Sao mang Lộc, Quyền, Khoa, Kỵ theo can năm sinh.
const HOA=[
 ["Liêm Trinh","Phá Quân","Vũ Khúc","Thái Dương"],["Thiên Cơ","Thiên Lương","Tử Vi","Thái Âm"],
 ["Thiên Đồng","Thiên Cơ","Văn Xương","Liêm Trinh"],["Thái Âm","Thiên Đồng","Thiên Cơ","Cự Môn"],
 ["Tham Lang","Thái Âm","Hữu Bật","Thiên Cơ"],["Vũ Khúc","Tham Lang","Thiên Lương","Văn Khúc"],
 ["Thái Dương","Vũ Khúc","Thái Âm","Thiên Đồng"],["Cự Môn","Thái Dương","Văn Khúc","Văn Xương"],
 ["Thiên Lương","Tử Vi","Tả Phù","Vũ Khúc"],["Phá Quân","Cự Môn","Thái Âm","Tham Lang"]
];

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
  const quadrant=Math.floor(mod(chi+1)/3);
  add(2+3*quadrant,"Cô Thần"); add(10+3*quadrant,"Quả Tú");
  add(6-chi,"Thiên Khốc"); add(6+chi,"Thiên Hư");
  add(9+month-1,"Thiên Hình"); add(1+month-1,"Thiên Diêu");
  add([5,1,9][chi%3],"Phá Toái");
  HOA[can].forEach((star,i)=>{
    const host=houses.find(h=>h.major.includes(star)||h.minor.includes(star));
    add(host.index,["Hóa Lộc","Hóa Quyền","Hóa Khoa","Hóa Kỵ"][i]);
  });
  const triet=8-2*(can%5);
  add(triet,"Triệt"); add(triet+1,"Triệt");
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
// Từ điển diễn giải biên tập cho ứng dụng. Mỗi sao có năm cách đọc,
// theo thứ tự Mệnh, Quan Lộc, Tài Bạch, Phu Thê và Tật Ách.
// Các câu là gợi ý tự đối chiếu, không dùng để suy ra bệnh hay sự kiện.
const STAR_READINGS = {
  "Tử Vi":["thích tự quyết và đứng ra chịu trách nhiệm","hợp với việc phân công và nhìn toàn cục","ưu tiên chủ động phân bổ nguồn lực","mong hai người tôn trọng vai trò của nhau","dễ tự nhận nhiều trách nhiệm"],
  "Thiên Cơ":["thường cân nhắc nhiều cách trước khi chọn","có thể phát huy ở việc phân tích và cải tiến quy trình","thích so sánh phương án trước khi chi tiêu","muốn bàn kỹ các kế hoạch chung","dễ tiếp tục nghĩ về việc còn dang dở khi đã đến giờ nghỉ"],
  "Thái Dương":["thích chia sẻ thẳng thắn và giúp người khác","dễ phát huy khi hướng dẫn hoặc đại diện cho nhóm","coi trọng sự minh bạch khi dùng tiền chung","thường thể hiện sự quan tâm qua hành động","dễ dành thời gian cho người khác trước bản thân"],
  "Vũ Khúc":["thực tế, coi trọng kết quả cụ thể","hợp với nhiệm vụ cần kỷ luật và đo được kết quả","chú ý con số, ngân sách và phần tích lũy","thường thể hiện tình cảm bằng việc làm cụ thể","có xu hướng giữ lịch sinh hoạt khá nghiêm"],
  "Thiên Đồng":["ưa hòa khí và dễ thích nghi","phát huy trong môi trường có sự hỗ trợ giữa đồng nghiệp","dễ dành tiền cho sự thoải mái và trải nghiệm","coi trọng cảm giác được lắng nghe","dễ duy trì thói quen khi thấy thoải mái với nhịp sống"],
  "Liêm Trinh":["để ý nguyên tắc và ranh giới cá nhân","hợp với việc cần phân định trách nhiệm rõ ràng","coi trọng nguyên tắc trong chuyện tiền chung","cần làm rõ kỳ vọng và giới hạn của mỗi người","dễ đặt yêu cầu cao cho bản thân"],
  "Thiên Phủ":["điềm tĩnh và muốn có sự chuẩn bị","có thế mạnh ở việc giữ nhịp vận hành và quản lý nguồn lực","thiên về giữ quỹ dự phòng và tính đường dài","coi trọng sự ổn định của gia đình","dễ duy trì nếp sinh hoạt đều đặn"],
  "Thái Âm":["kín đáo và thường suy nghĩ kỹ","phù hợp với việc cần chiều sâu và sự tỉ mỉ","thiên về tích lũy từng bước","nhạy với những thay đổi nhỏ trong cách người thân cư xử","cần khoảng thời gian riêng để thả lỏng"],
  "Tham Lang":["tò mò, thích thử điều mới","dễ phát huy khi được giao tiếp và mở rộng quan hệ","dễ chú ý tới nhiều cơ hội kiếm tiền cùng lúc","đề cao sự gắn kết và những trải nghiệm chung","lịch giao lưu dễ lấn vào thời gian nghỉ"],
  "Cự Môn":["hay đặt câu hỏi và muốn hiểu cho rõ","phát huy khi cần giải thích, thương lượng hoặc phản biện","chú trọng việc làm rõ điều khoản khi trao đổi tiền bạc","dễ vướng hiểu lầm nếu hai người ngầm đoán ý nhau","dễ mang một cuộc tranh luận vào giờ nghỉ"],
  "Thiên Tướng":["quan tâm đến công bằng và giữ lời","hợp với vai trò phối hợp, làm rõ trách nhiệm giữa các bên","coi trọng sự công bằng khi chia sẻ chi phí","coi trọng sự đồng hành và chia việc công bằng","dễ ưu tiên chăm lo cho người xung quanh"],
  "Thiên Lương":["thận trọng và thường muốn bảo vệ người khác","phát huy trong công việc hướng dẫn hoặc rà soát chuẩn mực","thiên về cân nhắc sự bền vững trước một khoản chi","muốn tạo cảm giác an tâm cho người thân","có xu hướng duy trì những thói quen quen thuộc"],
  "Thất Sát":["quyết đoán, thích tự xử lý việc khó","dễ phát huy khi mục tiêu rõ và có quyền chủ động","thường muốn quyết nhanh khi có cơ hội","cần khoảng riêng và thích trao đổi thẳng","dễ giữ nhịp làm việc cao khi có việc gấp"],
  "Phá Quân":["sẵn sàng thay đổi cách làm đã quen","dễ phát huy khi cần sửa một cách làm cũ","sẵn sàng đổi kế hoạch khi cách cũ không còn phù hợp","muốn cả hai linh hoạt khi hoàn cảnh thay đổi","nhịp sinh hoạt dễ thay đổi theo công việc"]
};
function palaceName(h){return CUNG[h.kind]+" tại "+CHI[h.index];}
function evidence(chart,h){
  const opposite=chart.houses[mod(h.index+6)];
  return "Cung "+palaceName(h)+". "+(h.major.length?majorText(h):"Vô chính diệu, tham chiếu đối cung "+palaceName(opposite)+" có "+majorText(opposite))+
    (h.minor.length?". Sao đi cùng gồm "+h.minor.join(", "):"")+".";
}
// Mỗi đoạn dưới đây chỉ được dùng khi toàn bộ sao của bộ thực sự đồng cung.
const COMBINATIONS=[
 [["Thất Sát","Thiên Mã","Địa Không"],"Thất Sát thiên về quyết đoán, Thiên Mã thiên về di chuyển, còn Địa Không gợi những lần kế hoạch đổi hướng bất ngờ. Ghép ba ý lại, sở trường là dám nhận việc chưa có tiền lệ. Mặt khó là có thể đi quá nhanh khi thông tin còn thiếu. Khi thử cách mới, nên xác định trước dấu hiệu nào sẽ khiến mình dừng lại và xem xét lại."],
 [["Tử Vi","Thiên Phủ"],"Tử Vi chủ về đứng ra định hướng, Thiên Phủ chủ về gìn giữ và tổ chức nguồn lực. Đây là bộ Tử Phủ đồng cung: sức mạnh của nó nằm ở việc vừa quyết được việc, vừa giữ được người và nguồn lực để thực hiện. Nếu đóng ở Thiên Di, ý này dễ thấy nhất khi làm việc với đối tác hoặc một nhóm mới."],
 [["Phá Quân","Kình Dương"],"Phá Quân thiên về tháo bỏ cái cũ; Kình Dương làm nổi bật sức ép khi phải quyết nhanh. Trong công việc, bộ này hợp với tình huống một quy trình đã gây sai sót và cần người đứng ra sửa. Chỗ dễ vướng là người đang làm theo quy trình cũ có thể phản ứng nếu chưa hiểu lý do thay đổi."],
 [["Tham Lang","Điếu Khách"],"Tham Lang nghiêng về tìm cơ hội qua giao tiếp. Điếu Khách làm nổi vai trò của lời giới thiệu, thương lượng và chi phí giao tế. Một mối quen biết có thể mở đầu một thương vụ, nhưng doanh thu thực thu mới cho biết cơ hội ấy có giá trị đến đâu."],
 [["Thái Dương","Lộc Tồn"],"Thái Dương gợi sự rõ ràng và chủ động, Lộc Tồn thiên về giữ gìn những gì đã tích lũy. Ở cung Điền, bộ này được đọc theo hướng gây dựng chỗ ở từng bước: biết mình cần nơi ở như thế nào, dành nguồn lực cho nó và chăm chút lâu dài. Giá trị thực tế vẫn tùy tài sản và khả năng chi trả."],
 [["Vũ Khúc","Đà La"],"Vũ Khúc muốn thấy kết quả cụ thể, còn Đà La gợi việc kéo dài hoặc phải làm lại. Hai tính chất đặt cạnh nhau dễ thành cảm giác sốt ruột: đã bỏ công mà kết quả chưa theo kịp. Chia việc thành những mốc có thể kiểm tra sẽ dễ thấy phần nào thực sự đang tiến triển."],
 [["Liêm Trinh","Thiên Tướng"],"Liêm Trinh coi trọng ranh giới, Thiên Tướng coi trọng sự công bằng. Trong quan hệ thân thiết, điều dễ gây băn khoăn là hai người đều nghĩ mình đã làm tròn phần việc nhưng lại mong ở nhau những điều khác nhau. Nói cụ thể về thời gian, tiền chung và trách nhiệm gia đình sẽ dễ hiểu nhau hơn."],
 [["Văn Xương","Văn Khúc","Hóa Khoa"],"Xương và Khúc nghiêng về cách trình bày; Hóa Khoa nhấn vào việc năng lực được nhìn nhận qua bằng chứng. Nếu đang tìm việc, hãy chuẩn bị một ví dụ có số liệu cho CV hoặc buổi phỏng vấn. Người từng làm cùng có thể giúp nhận xét xem câu chuyện đã đủ rõ chưa."],
 [["Thiên Đồng","Hóa Lộc"],"Thiên Đồng thiên về thích nghi và xây dựng hòa khí; Hóa Lộc gợi sự hỗ trợ hoặc trao đổi thuận lợi. Trong thực tế, đôi khi đó chỉ là một cuộc nói chuyện giúp tháo gỡ vướng mắc. Hãy nói rõ mình đang cần điều gì để người khác dễ hỗ trợ."]
];
const ADDITIONS=[
 [["Địa Không","Cô Thần"],"Địa Không đi cùng Cô Thần gợi khuynh hướng tự tìm lối riêng. Khi chịu áp lực, điểm dễ bỏ sót là giữ cả phần khó cho mình mà chưa nói cho người có thể giúp."],
 [["Địa Kiếp","Bạch Hổ"],"Địa Kiếp và Bạch Hổ thêm nét cạnh tranh, nhất là khi quyền hạn và trách nhiệm giữa các bên chưa rõ. Thỏa thuận cụ thể ai quyết định, ai chịu trách nhiệm sẽ giúp mặt tổ chức của bộ sao phát huy tốt hơn."],
 [["Kình Dương","Thiên Hình"],"Kình Dương và Thiên Hình cùng cung làm nổi bật chuyện quy tắc và tranh luận. Khi đề xuất một thay đổi có nhiều bên liên quan, hãy thống nhất phạm vi và ghi lại tiêu chí hoàn thành trước khi triển khai."],
 [["Thiên Diêu","Quả Tú"],"Thiên Diêu gợi sức hấp dẫn của một cơ hội, Quả Tú gợi xu hướng tự cân nhắc một mình. Với chuyện tiền bạc, một bước đối chiếu độc lập có thể giúp phát hiện chi phí mình chưa tính."],
 [["Hóa Kỵ"],"Hóa Kỵ ở cung này được đọc như điểm dễ hiểu lầm hoặc bận lòng. Khi một việc gây khó chịu, thử nhắc lại điều mình nghe được và hỏi xem đó có đúng ý người kia hay không."],
 [["Tả Phù","Hữu Bật"],"Tả Phù và Hữu Bật gợi sự trợ giúp từ hai phía. Có thể bắt đầu bằng một lời nhờ cụ thể, chẳng hạn nhờ người quen đọc hồ sơ hoặc giới thiệu đúng đầu mối."],
 [["Tang Môn"],"Tang Môn gợi khuynh hướng để tâm lâu đến việc còn dang dở. Một việc đáng làm là phân biệt phần mình có thể xử lý ngay với phần cần thêm thông tin."]
];
function combination(h,rules){
  const present=new Set([...h.major,...h.minor]);
  return rules.find(([required])=>required.every(s=>present.has(s)))?.[1]||"";
}
function plain(chart,h,domain){
  const source=h.major.length?h:chart.houses[mod(h.index+6)];
  return source.major.map(s=>s+" gợi nét "+STAR_READINGS[s][domain]).join("; ")+".";
}
function paragraph(label,body){return {label,body};}
function natalReport(chart){
  const byKind=k=>chart.houses.find(h=>h.kind===k);
  const topics=[
    [0,0,"Mệnh & Thân · Con người và hướng phát triển","Khi tự quyết một việc khó, hãy thử nói rõ điều mình còn chưa chắc với một người tin cậy trước khi bắt tay làm."],
    [4,1,"Công danh & sự nghiệp","Nếu muốn đổi vai trò, hãy chọn một việc từng làm tốt, nói rõ vấn đề ban đầu, cách xử lý và kết quả. Đó là cơ sở thực tế để nhận ra môi trường phù hợp."],
    [8,2,"Tài chính & tiền bạc","Khi cân nhắc một cơ hội kiếm tiền, hãy viết ra chi phí, thời hạn thu tiền và khoản mình có thể dành cho nó."],
    [3,2,"Nhà cửa & đất đai","Nếu đang tính chuyện chỗ ở, có thể bắt đầu từ nhu cầu ở thực, chi phí duy trì và nguồn tiền hiện có."],
    [10,3,"Tình duyên & gia đạo","Nếu đang xây dựng một mối quan hệ, hãy trao đổi về điều mỗi người cần. Nếu đã có gia đình, có thể bắt đầu từ cách chia thời gian và việc nhà."],
    [7,4,"Sức khỏe & nếp sinh hoạt","Hãy đối chiếu với giờ nghỉ, mức độ bận rộn và khả năng hồi phục thực tế. Lá số không cho biết bệnh hay tai nạn nào sẽ xảy ra."]
  ];
  return topics.map(([kind,domain,title,action])=>{
    const h=byKind(kind);
    const lines=[paragraph("Các sao nói gì?",combination(h,COMBINATIONS)||plain(chart,h,domain))];
    const extra=combination(h,ADDITIONS);
    if(extra)lines.push(paragraph("Điểm cần cân bằng",extra));
    if(kind===0){
      const than=chart.houses[chart.than];
      lines.push(paragraph("Thân cư "+CUNG[than.kind],"Mệnh nói về cách bạn phản ứng ban đầu. Thân cho biết phần đời sống thường bộc lộ rõ hơn qua trải nghiệm: ở lá số này là "+CHU_DE[than.kind]+". "+evidence(chart,than)),
        paragraph("Khi ra quyết định",combination(than,COMBINATIONS)||plain(chart,than,0)));
      const addon=combination(than,ADDITIONS);if(addon)lines.push(paragraph("Mặt thử thách",addon));
    }
    if(kind===10){const family=byKind(2);lines.push(paragraph("Nếp nhà","Cung Phúc Đức nói về môi trường gia đình. "+evidence(chart,family)+" "+(combination(family,COMBINATIONS)||plain(chart,family,3))));}
    lines.push(paragraph("Áp dụng vào đời sống",action));
    return {title,lines,basis:evidence(chart,h)};
  });
}
function annualReport(chart,year,f){
  const annual=chart.houses[f.annual], focus=chart.houses[branch(year)];
  const lines=[];
  if(f.decade){
    const position=f.age-f.decade.start+1;
    lines.push(paragraph("Nền của mười năm","Đại hạn "+f.decade.start+"–"+(f.decade.start+9)+" tuổi ở cung "+palaceName(f.decade)+". Đây là năm thứ "+position+" trong đại hạn. "+(combination(f.decade,COMBINATIONS)||plain(chart,f.decade,0))));
  }else lines.push(paragraph("Đại hạn",f.age<chart.cuc?"Chưa tới tuổi bắt đầu đại hạn đầu tiên.":"Đã qua mười hai đại hạn hiển thị trên bàn số."));
  lines.push(paragraph("Tiểu hạn của năm","Tiểu hạn ở cung "+palaceName(annual)+", nên khi đọc năm này, trọng tâm là "+CHU_DE[annual.kind]+". "+(f.decade===annual?"Tiểu hạn trùng đại hạn: cùng một chủ đề xuất hiện ở cả bối cảnh dài hạn và năm đang xem.":"Hãy đọc chủ đề năm trong bối cảnh đại hạn nêu trên.")));
  lines.push(paragraph("Nơi Lưu Thái Tuế tác động","Lưu Thái Tuế đóng ở cung "+palaceName(focus)+", làm nổi chủ đề "+CHU_DE[focus.kind]+". "+(combination(focus,COMBINATIONS)||plain(chart,focus,focus.kind===4?1:0))));
  for(const [star,meaning] of [["Lưu Lộc Tồn","gợi ý xem nguồn lực nào đang sẵn có và phần nào nên giữ lại"],["Lưu Kình Dương","đánh dấu nơi dễ phát sinh bất đồng hoặc cần quyết nhanh"],["Lưu Đà La","nhấn vào việc kéo dài, cần thêm thời gian hoặc phải làm lại"]]){
    const i=f.moving.findIndex(stars=>stars.includes(star)),h=chart.houses[i];
    lines.push(paragraph(star,"Ở cung "+palaceName(h)+", sao này "+meaning+". "+(h.minor.includes(star.slice(4))?"Sao gốc và sao lưu trùng cung, vì vậy nét này được nhắc lại ở cả hai lớp.":"")));
  }
  return {title:"Vận hạn "+year+" · "+canChi(year),lines,basis:f.age+" tuổi mụ. Tiểu hạn tại "+CHI[f.annual]+", Lưu Thái Tuế tại "+CHI[branch(year)]+"."};
}
// Lấy ba tháng âm thực sự liên tiếp; giữ tháng nhuận và chuyển năm khi cần.
function threeMonths(year,start){
  let k=winterMonth(year-1);
  function info(k){
    const day=newMoon(k), end=newMoon(k+1)-1;
    const date=new Date((day-2440588)*86400000);
    const lunar=lunarDate(date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate());
    return {...lunar,first:day,end};
  }
  for(let n=0;n<28;n++,k++){
    const l=info(k);
    if(l.year===year&&l.month===start&&!l.leap)return [l,info(k+1),info(k+2)];
  }
  throw new Error("Không tìm được tháng âm lịch.");
}
function solarLabel(jd){
  const d=new Date((jd-2440588)*86400000);
  return d.getUTCDate()+"/"+(d.getUTCMonth()+1)+"/"+d.getUTCFullYear();
}
const MONTH_ACTION=["Nếu đang phải chọn hướng đi, hãy viết ra một ưu tiên và một việc có thể hoàn thành ngay trong tháng.","Có thể tìm một người nhiều kinh nghiệm để xin nhận xét về hướng đi hoặc kế hoạch đang chuẩn bị.","Dành một buổi rà soát các việc gia đình còn dang dở, chọn việc cả nhà có thể cùng giải quyết.","Kiểm tra nhu cầu chỗ ở và những khoản chi gia đình sắp đến hạn.","Chọn một nhiệm vụ có kết quả đo được, làm rõ người chịu trách nhiệm và thời hạn.","Nếu cần sự giúp đỡ, hãy liên hệ một đồng nghiệp từng làm việc cùng và nêu rõ điều mình cần.","Khi gặp một nhóm hoặc môi trường mới, hãy thống nhất kỳ vọng hai bên trước khi nhận việc.","Theo dõi nhịp sinh hoạt thực tế và sắp xếp khoảng nghỉ cho những ngày bận.","Rà lại khoản thu chắc chắn, khoản đang chờ và các chi phí của tháng.","Dành thời gian cho việc chăm sóc hoặc trao đổi với người trong gia đình.","Chọn một việc hai người thường hiểu khác nhau để thống nhất cách xử lý.","Nếu đang tìm việc, có thể gửi CV cho người quen từng làm cùng và nhờ góp ý hoặc giới thiệu một vị trí phù hợp."];
function monthReport(chart,period){
  const {year,month,leap}=period,f=fortune(chart,year,month),h=chart.houses[f.monthly];
  const cc=CAN[mod(2*(stem(year)%5)+month+1,10)]+" "+CHI[mod(month+1)];
  const lines=[paragraph("Trọng tâm","Nguyệt hạn đi vào cung "+palaceName(h)+". Chủ đề tháng là "+CHU_DE[h.kind]+". "+(combination(h,COMBINATIONS)||plain(chart,h,h.kind===4?1:h.kind===8?2:0)))];
  const extra=combination(h,ADDITIONS);if(extra)lines.push(paragraph("Điểm đáng lưu ý",extra));
  lines.push(paragraph("Việc có thể làm",MONTH_ACTION[h.kind]));
  return {title:"Tháng "+month+(leap?" nhuận":"")+" âm · "+cc,lines,basis:solarLabel(period.first)+" – "+solarLabel(period.end)+" dương lịch. "+evidence(chart,h)};
}
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
  $("month").value=10;
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
      btn.append(meta,el("strong","",CUNG[h.kind]),el("span","major",majorText(h)||"Vô chính diệu"),el("span","minor",h.minor.join(" · ")));
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
    const reportCard=({title,lines,basis})=>{
      const card=el("article","panel");
      card.append(el("h3","",title),el("p","basis",basis));
      for(const {label,body} of lines){
        const p=el("p");p.append(el("strong","",label+(label.endsWith("?")?" ":". ")),document.createTextNode(body));card.append(p);
      }
      return card;
    };
    $("readings").replaceChildren(...[...natalReport(chart),annualReport(chart,year,f)].map(reportCard));
    const periods=threeMonths(year,+$("month").value);
    $("outlook").replaceChildren(...periods.map(period=>reportCard(monthReport(chart,period))));
    const steps=periods.map(p=>{
      const position=fortune(chart,p.year,p.month).monthly;
      return "Tháng "+p.month+(p.leap?" nhuận":"")+" ("+CUNG[chart.houses[position].kind]+"): "+MONTH_ACTION[chart.houses[position].kind];
    });
    $("plan").textContent=steps.join(" ");

  }
  function renderDetail(f){
    const h=chart.houses[selected],panel=$("detail");
    panel.replaceChildren(el("h3","","Cung "+CUNG[h.kind]),el("p","","Cung đóng tại "+CHI[selected]+", chủ về "+CHU_DE[h.kind]+"."),
    el("p","major",h.major.length?"Chính tinh: "+majorText(h):"Vô chính diệu · Xét thêm chính tinh tại đối cung "+CHI[mod(selected+6)]+": "+chart.houses[mod(selected+6)].major.join(", ")+"."),
    el("p","","Phụ tinh: "+(h.minor.join(", ")||"Không có trong nhóm sao cơ bản")+"."));
    if(mode!=="birth"){
      const meanings={"Lưu Thái Tuế":"chủ đề nổi bật của năm","Lưu Lộc Tồn":"nguồn lực và sự tích lũy","Lưu Kình Dương":"va chạm hoặc sức ép","Lưu Đà La":"việc trì hoãn, cần kiên nhẫn"};
      const flow=f.moving[selected];
      panel.append(el("p","flow",flow.length?flow.map(s=>s+" — "+meanings[s]).join(". ")+".":"Năm "+year+" không có sao lưu trong nhóm đang xét tại cung này."));
    }
  }
  $("profile").onsubmit=e=>{e.preventDefault();if(submit()) $("luangiai").scrollIntoView({block:"start"});};
  $("year").onchange=()=>{const old=mode;if(mode==="birth") mode="annual";if(!submit(false)) mode=old;};
  document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{
    const old=mode;mode=b.dataset.mode;if(!submit(false))mode=old;
  });
  $("month").onchange=()=>{mode="monthly";submit(false);};
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
