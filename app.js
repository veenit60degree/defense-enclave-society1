/* Defense Enclave Admin Buttons: 2026-09-19 */
//const CONFIG={SUPABASE_URL:'https://gujtekpteezejmtaxtcj.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_KvdsKcUr_vuvPrg7xU11Ww_q1H7vhg1'};

const SUPABASE_URL = "https://gujtekpteezejmtaxtcj.supabase.co/rest/v1/";   //https://gujtekpteezejmtaxtcj.supabase.co
const SUPABASE_KEY = "sb_publishable_KvdsKcUr_vuvPrg7xU11Ww_q1H7vhg1";



const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

//const CONFIG={SUPABASE_URL:'',SUPABASE_ANON_KEY:''};

//const CONFIG={
//    SUPABASE_URL:SUPABASE_URL,
//    SUPABASE_ANON_KEY:SUPABASE_KEY
//};


//let sb=null;if(CONFIG.SUPABASE_URL&&CONFIG.SUPABASE_ANON_KEY&&window.supabase)sb=window.supabase.createClient(CONFIG.SUPABASE_URL,CONFIG.SUPABASE_ANON_KEY);

const CONFIG={SUPABASE_URL:'https://gujtekpteezejmtaxtcj.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_KvdsKcUr_vuvPrg7xU11Ww_q1H7vhg1'};

let sb = null;

if (
    CONFIG.SUPABASE_URL &&
    CONFIG.SUPABASE_ANON_KEY &&
    window.supabase
) {
    sb = window.supabase.createClient(
        CONFIG.SUPABASE_URL,
        CONFIG.SUPABASE_ANON_KEY
    );
}

const demo={members:[['RS','Raj Sharma','A-101'],['PK','Priya Kapoor','A-102'],['MG','Manoj Gupta','A-103'],['AJ','Alex Johnson','A-104'],['SK','Sonia Kaur','B-201'],['VS','Vikas Singh','B-202'],['AM','Anita Mehta','B-203'],['NK','Nitin Kumar','C-301'],['PS','Pooja Sethi','C-302']],works:[['Main Gate Repair','Repair and repaint main entrance gate','Ongoing',72,'12 Sep 2026'],['Street Light Upgrade','Replace 18 old lights with LED fixtures','Ongoing',45,'18 Sep 2026'],['Park Renovation','Benches, pathway and plantation work','Pending',0,'25 Sep 2026'],['Water Tank Cleaning','Annual cleaning and inspection','Completed',100,'05 Sep 2026']],events:[['20 Sep 2026','Monthly General Meeting','Community Hall · 6:00 PM','◷'],['02 Oct 2026','Cleanliness Drive','Main Park · 7:00 AM','♧'],['18 Oct 2026','Family Sports Day','Society Ground · 4:00 PM','★']],gallery:['Society Meeting','Independence Day','Park Activity','Festival Evening','Cleanliness Drive','Community Gathering']};
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function renderPublic(){document.getElementById('publicStats').innerHTML=[['Society Fund','₹18,42,500','Current balance'],['Total Expenses','₹6,84,250','This year'],['Active Maintenance','₹2,48,000','12 active items'],['Pending Tasks','17','Needs attention']].map(x=>`<div class="stat"><div class="stat-head">${x[0]}<span>●</span></div><div class="value">${x[1]}</div><div class="trend">${x[2]}</div></div>`).join('');document.getElementById('memberGrid').innerHTML=demo.members.map(p=>`<div class="member-card"><div class="member-photo">${p[0]}</div><div><strong>${p[1]}</strong><div class="muted">House ${p[2]}</div><span class="status ongoing" style="margin-top:6px">Active Member</span></div></div>`).join('');document.getElementById('workTable').innerHTML=`<thead><tr><th>Project</th><th>Description</th><th>Status</th><th>Progress</th><th>Target</th></tr></thead><tbody>${demo.works.map(w=>`<tr><td><strong>${w[0]}</strong></td><td>${w[1]}</td><td><span class="status ${w[2].toLowerCase()}">${w[2]}</span></td><td><div class="progress"><i style="width:${w[3]}%"></i></div>${w[3]}%</td><td>${w[4]}</td></tr>`).join('')}</tbody>`;document.getElementById('eventGrid').innerHTML=demo.events.map(e=>`<div class="card"><div class="photo">${e[3]}</div><div class="card-body"><div class="event-date">${e[0]}</div><h3>${e[1]}</h3><div class="muted">${e[2]}</div></div></div>`).join('');document.getElementById('galleryGrid').innerHTML=demo.gallery.map((g,i)=>`<div class="card"><div class="photo">${['◉','★','♧','✦','✓','◎'][i]}</div><div class="card-body"><strong>${g}</strong><div class="muted" style="margin-top:5px">${10+i*3} photos</div></div></div>`).join('')}
renderPublic();
const authModal=document.getElementById('authModal');const showLogin=()=>{document.getElementById('authHeading').textContent='Member Login';document.getElementById('authLogin').classList.remove('hidden');document.getElementById('authRegister').classList.add('hidden');authModal.classList.remove('hidden')};const showReg=()=>{document.getElementById('authHeading').textContent='Create Member Account';document.getElementById('authLogin').classList.add('hidden');document.getElementById('authRegister').classList.remove('hidden');authModal.classList.remove('hidden')};document.getElementById('openLogin').onclick=showLogin;document.getElementById('openRegister').onclick=showReg;document.getElementById('authClose').onclick=()=>authModal.classList.add('hidden');document.getElementById('switchRegister').onclick=showReg;document.getElementById('switchLogin').onclick=showLogin;
async function login(){
    const email=document.getElementById('loginEmail').value.trim();
    const password=document.getElementById('loginPassword').value;
    if(!email||!password)return toast('Please enter email and password');
    if(!sb)return toast('Supabase is not configured yet');
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    if(error)return toast(error.message);
    const result=await sb.from('profiles').select('*').eq('id',data.user.id).maybeSingle();
    if(result.error)console.error('Profile loading error:',result.error);
    const profile=result.data;
    authModal.classList.add('hidden');
    const user={...data.user,name:profile?.full_name||data.user.user_metadata?.full_name||data.user.email?.split('@')[0]||'Member',email:data.user.email||'',phone:profile?.phone||'',house_no:profile?.house_number||profile?.house_no||'',address:profile?.address||'',role:profile?.role||'member'};
    if(user.role==='admin') openAdminDashboard(user); else openMemberDashboard(user);
    toast('Login successful');
}
async function register(){
    const name=document.getElementById('regName').value.trim();
    const email=document.getElementById('regEmail').value.trim();
    const password=document.getElementById('regPassword').value;
    const phone=document.getElementById('regPhone').value.trim();
    const house_no=document.getElementById('regHouse').value.trim();
    const address=document.getElementById('regAddress').value.trim();
    if(!name||!email||!password||!house_no)return toast('Please fill name, email, house and password');
    if(password.length<6)return toast('Password must be at least 6 characters');
    if(!sb)return toast('Supabase is not configured yet');
    const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});
    if(error)return toast(error.message);
    if(!data.user)return toast('Registration could not be completed');
    const profileResult=await sb.from('profiles').update({full_name:name,email:data.user.email||email,phone:phone||null,house_number:house_no,address:address||null}).eq('id',data.user.id);
    if(profileResult.error){console.error('Profile update error:',profileResult.error);return toast('Account created, but profile details could not be saved');}
    authModal.classList.add('hidden');
    if(!data.session){showLogin();return toast('Registration successful. Please verify your email before login.');}
    openMemberDashboard({...data.user,name,email,phone,house_no,address,role:'member'});
    toast('Registration complete');
}
document.getElementById('loginBtn').onclick=login;
document.getElementById('registerBtn').onclick=register;
function openAdminDashboard(user){
 document.getElementById('public').classList.add('hidden');
 const app=document.getElementById('memberApp'); app.className='app-shell';
 app.innerHTML=`<aside class="sidebar"><div class="brand"><div class="brand-mark">DE</div><div><strong>Defense Enclave</strong><span>Admin Portal</span></div></div><nav>
 <button class="nav-item active" data-a="dashboard">⌂ <span>Dashboard</span></button>
 <button class="nav-item" data-a="finance">₹ <span>Society Finance</span></button>
 <button class="nav-item" data-a="maintenance">▣ <span>Maintenance</span></button>
 <button class="nav-item" data-a="work">⚙ <span>Society Work</span></button>
 <button class="nav-item" data-a="events">◷ <span>Events</span></button>
 <button class="nav-item" data-a="gallery">▧ <span>Gallery</span></button>
 <button class="nav-item" data-a="members">♙ <span>Members</span></button>
 <button class="nav-item" data-a="complaints">⚑ <span>Complaints</span></button>
 <button class="nav-item" data-a="map">⌖ <span>Society Map</span></button>
 </nav><div class="sidebar-bottom"><div class="user-mini"><div class="avatar">${initials(user.name)}</div><div><strong>${user.name}</strong><span>Administrator</span></div></div><button class="outline-btn" id="adminLogout">Log out</button></div></aside>
 <main class="main"><header class="topbar"><div><div class="eyebrow">DEFENSE ENCLAVE SOCIETY</div><h1 id="adminTitle">Admin Dashboard</h1></div><div class="top-actions"><span class="status ongoing">ADMIN</span><div class="avatar">${initials(user.name)}</div></div></header><section id="adminContent" class="content"></section></main>`;
 const nav=app.querySelector('nav'); nav.onclick=e=>{const b=e.target.closest('.nav-item');if(!b)return;adminPage(b.dataset.a,user)};
 document.getElementById('adminLogout').onclick=async()=>{if(sb) await sb.auth.signOut();app.classList.add('hidden');document.getElementById('public').classList.remove('hidden');toast('Logged out')};
 adminPage('dashboard',user);
}
function initials(n){return (n||'Admin').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()}

async function saveFinance(){
    if(!sb) return toast('Supabase is not configured.');

    const fund = Number(document.getElementById('adminFund')?.value || 0);
    const expenses = Number(document.getElementById('adminExpenses')?.value || 0);
    const maintenance = Number(document.getElementById('adminMaintenance')?.value || 0);
    const pending = Number(document.getElementById('adminPending')?.value || 0);

    if([fund,expenses,maintenance,pending].some(v => !Number.isFinite(v) || v < 0))
        return toast('Please enter valid finance values.');

    const {error} = await sb.from('society_finance').upsert({
        id: 1,
        society_fund: fund,
        total_expenses: expenses,
        active_maintenance: maintenance,
        pending_tasks: Math.floor(pending),
        updated_at: new Date().toISOString()
    }, {onConflict:'id'});

    if(error){
        console.error('Finance save error:', error);
        return toast('Finance save failed: ' + error.message);
    }

    toast('Finance saved successfully.');
    await adminPage('finance', window.__adminUser);
}

function adminAddMaintenance(){
    const item = prompt('Maintenance item name:');
    if(!item) return;
    const amount = prompt('Amount:','0');
    if(amount===null) return;
    const status = prompt('Status (Active/Pending/Completed):','Active') || 'Active';
    window.__maintenance = window.__maintenance || [
        {item:'Street Light Repair',amount:45000,status:'Active'},
        {item:'Park Maintenance',amount:80000,status:'Active'}
    ];
    window.__maintenance.push({item,amount:Number(amount)||0,status});
    toast('Maintenance added');
    adminPage('maintenance',window.__adminUser);
}

function adminEditMaintenance(i){
    const x = window.__maintenance[i];
    if(!x) return;
    const item = prompt('Maintenance item:',x.item);
    if(item===null) return;
    const amount = prompt('Amount:',x.amount);
    if(amount===null) return;
    const status = prompt('Status:',x.status);
    if(status===null) return;
    x.item=item; x.amount=Number(amount)||0; x.status=status;
    toast('Maintenance updated');
    adminPage('maintenance',window.__adminUser);
}

function adminDeleteMaintenance(i){
    if(!confirm('Delete this maintenance item?')) return;
    window.__maintenance.splice(i,1);
    toast('Maintenance deleted');
    adminPage('maintenance',window.__adminUser);
}

function adminAddWork(){
    const name=prompt('Work / project name:');
    if(!name) return;
    const desc=prompt('Description:','');
    const status=prompt('Status (Ongoing/Pending/Completed):','Pending') || 'Pending';
    const progress=prompt('Progress %:','0');
    const target=prompt('Target date:','');
    demo.works.push([name,desc||'',status,Math.max(0,Math.min(100,Number(progress)||0)),target||'']);
    toast('Work added');
    adminPage('work',window.__adminUser);
}

function adminEditWork(i){
    const w=demo.works[i];
    if(!w) return;
    const name=prompt('Work / project name:',w[0]);
    if(name===null) return;
    const desc=prompt('Description:',w[1]);
    if(desc===null) return;
    const status=prompt('Status:',w[2]);
    if(status===null) return;
    const progress=prompt('Progress %:',w[3]);
    if(progress===null) return;
    const target=prompt('Target date:',w[4]);
    if(target===null) return;
    w[0]=name; w[1]=desc; w[2]=status; w[3]=Math.max(0,Math.min(100,Number(progress)||0)); w[4]=target;
    toast('Work updated');
    adminPage('work',window.__adminUser);
}

function adminAddEvent(){
    const date=prompt('Event date:', '20 Sep 2026');
    if(!date) return;
    const title=prompt('Event title:');
    if(!title) return;
    const place=prompt('Location / time:','');
    const icon=prompt('Icon:','◷') || '◷';
    demo.events.push([date,title,place||'',icon]);
    toast('Event added');
    adminPage('events',window.__adminUser);
}

function adminEditEvent(i){
    const e=demo.events[i];
    if(!e) return;
    const date=prompt('Event date:',e[0]); if(date===null)return;
    const title=prompt('Event title:',e[1]); if(title===null)return;
    const place=prompt('Location / time:',e[2]); if(place===null)return;
    e[0]=date;e[1]=title;e[2]=place;
    toast('Event updated');
    adminPage('events',window.__adminUser);
}

function adminDeleteEvent(i){
    if(!confirm('Delete this event?')) return;
    demo.events.splice(i,1);
    toast('Event deleted');
    adminPage('events',window.__adminUser);
}

function adminAddGalleryFolder(){
    const name=prompt('New gallery folder name:');
    if(!name) return;
    demo.gallery.push(name);
    toast('Gallery folder added');
    adminPage('gallery',window.__adminUser);
}

function adminUploadGallery(i){
    const input=document.createElement('input');
    input.type='file';
    input.accept='image/*';
    input.multiple=true;
    input.onchange=()=>{
        if(input.files?.length)
            toast(`${input.files.length} photo(s) selected for "${demo.gallery[i]}"`);
    };
    input.click();
}

function adminAddMember(){
    const name=prompt('Member name:');
    if(!name) return;
    const house=prompt('House / Flat number:','');
    demo.members.push([initials(name),name,house||'']);
    toast('Member added');
    adminPage('members',window.__adminUser);
}

function adminEditMember(i){
    const m=demo.members[i];
    if(!m) return;
    const name=prompt('Member name:',m[1]); if(name===null)return;
    const house=prompt('House / Flat:',m[2]); if(house===null)return;
    m[0]=initials(name);m[1]=name;m[2]=house;
    toast('Member updated');
    adminPage('members',window.__adminUser);
}

function adminDeleteMember(i){
    if(!confirm('Remove this member from the society list?')) return;
    demo.members.splice(i,1);
    toast('Member removed');
    adminPage('members',window.__adminUser);
}

function adminUpdateComplaint(){
    const status=prompt('Complaint status (Submitted/In Progress/Resolved):','In Progress');
    if(status===null)return;
    toast('Complaint status updated to '+status);
}

function adminUploadMap(){
    const input=document.getElementById('mapPdf');
    const file=input?.files?.[0];
    if(!file) return toast('Please select a PDF first.');
    if(file.type!=='application/pdf') return toast('Only PDF files are allowed.');
    if(file.size>10*1024*1024) return toast('PDF must be 10 MB or smaller.');
    window.__societyMapName=file.name;
    toast('Map selected: '+file.name);
}

async function adminPage(p,user){
 const c=document.getElementById('adminContent'),t=document.getElementById('adminTitle');
 document.querySelectorAll('#memberApp .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.a===p));
 const titles={dashboard:'Admin Dashboard',finance:'Society Finance',maintenance:'Active Maintenance',work:'Society Work',events:'Events',gallery:'Photo Gallery',members:'Members',complaints:'Complaints',map:'Society Map'}; t.textContent=titles[p]||'Admin Dashboard';
 if(p==='dashboard') c.innerHTML=`<div class="hero"><div><div class="eyebrow">ADMINISTRATION</div><h2>Welcome, ${user.name}</h2><div class="muted">Manage Defense Enclave Society information from one place.</div></div></div><div class="stats"><div class="stat"><div class="stat-head">Society Fund<span>●</span></div><div class="value">₹18,42,500</div><div class="trend">Manage in Finance</div></div><div class="stat"><div class="stat-head">Total Expenses<span>●</span></div><div class="value">₹6,84,250</div><div class="trend">Manage expenses</div></div><div class="stat"><div class="stat-head">Active Maintenance<span>●</span></div><div class="value">₹2,48,000</div><div class="trend">Manage maintenance</div></div><div class="stat"><div class="stat-head">Pending Tasks<span>●</span></div><div class="value">17</div><div class="trend">Review society work</div></div></div><div class="grid-2-equal"><div class="panel"><h3>Management</h3><div class="activity"><div class="activity-item"><div class="activity-icon">₹</div><div><strong>Society Finance</strong><p>Update fund, expenses and maintenance.</p></div></div><div class="activity-item"><div class="activity-icon">♙</div><div><strong>Members</strong><p>Add, edit and manage society members.</p></div></div><div class="activity-item"><div class="activity-icon">▧</div><div><strong>Gallery</strong><p>Manage photo categories and uploads.</p></div></div></div></div><div class="panel"><h3>Quick actions</h3><div class="form-grid"><button class="primary-btn" onclick="adminPage('finance',window.__adminUser)">Manage Finance</button><button class="primary-btn" onclick="adminPage('members',window.__adminUser)">Manage Members</button><button class="primary-btn" onclick="adminPage('events',window.__adminUser)">Manage Events</button><button class="primary-btn" onclick="adminPage('gallery',window.__adminUser)">Manage Gallery</button></div></div></div>`;
 else if(p==='finance'){
   const {data:f,error:financeError}=await sb.from('society_finance').select('*').eq('id',1).maybeSingle();
   if(financeError){console.error(financeError);return toast('Finance load failed: '+financeError.message)}
   const v=f||{society_fund:1842500,total_expenses:684250,active_maintenance:248000,pending_tasks:17};
   c.innerHTML=`<div class="hero"><div><h2>Society Finance</h2><div class="muted">Values are loaded from Supabase.</div></div></div><div class="panel"><div class="form-grid"><label>Society Fund<input id="adminFund" type="number" min="0" value="${Number(v.society_fund)||0}"></label><label>Total Expenses<input id="adminExpenses" type="number" min="0" value="${Number(v.total_expenses)||0}"></label><label>Active Maintenance<input id="adminMaintenance" type="number" min="0" value="${Number(v.active_maintenance)||0}"></label><label>Pending Tasks<input id="adminPending" type="number" min="0" value="${Number(v.pending_tasks)||0}"></label></div><div style="margin-top:16px"><button class="primary-btn" onclick="saveFinance()">Save Finance</button></div></div>`;
}
 else if(p==='maintenance'){
 window.__maintenance=window.__maintenance||[{item:'Street Light Repair',amount:45000,status:'Active'},{item:'Park Maintenance',amount:80000,status:'Active'}];
 c.innerHTML=`<div class="hero"><div><h2>Active Maintenance</h2><div class="muted">Manage active maintenance expenses.</div></div><button class="primary-btn" onclick="adminAddMaintenance()">+ Add Maintenance</button></div><div class="panel"><table class="table"><thead><tr><th>Item</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>${window.__maintenance.map((m,i)=>`<tr><td>${m.item}</td><td>₹${Number(m.amount).toLocaleString('en-IN')}</td><td><span class="status ongoing">${m.status}</span></td><td><button class="outline-btn" onclick="adminEditMaintenance(${i})">Edit</button> <button class="outline-btn" onclick="adminDeleteMaintenance(${i})">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}
 else if(p==='work') c.innerHTML=`<div class="hero"><div><h2>Society Work</h2><div class="muted">Ongoing, pending and completed projects.</div></div><button class="primary-btn" onclick="adminAddWork()">+ Add Work</button></div><div class="panel"><table class="table"><thead><tr><th>Project</th><th>Status</th><th>Progress</th><th>Target</th><th>Action</th></tr></thead><tbody>${demo.works.map((w,i)=>`<tr><td><strong>${w[0]}</strong><br><span class="muted">${w[1]}</span></td><td><span class="status ${w[2].toLowerCase()}">${w[2]}</span></td><td>${w[3]}%</td><td>${w[4]}</td><td><button class="outline-btn" onclick="adminEditWork(${i})">Edit</button></td></tr>`).join('')}</tbody></table></div>`;
 else if(p==='events') c.innerHTML=`<div class="hero"><div><h2>Events</h2><div class="muted">Add, edit or delete society events.</div></div><button class="primary-btn" onclick="adminAddEvent()">+ Add Event</button></div><div class="event-grid">${demo.events.map((e,i)=>`<div class="card"><div class="photo">${e[3]}</div><div class="card-body"><div class="event-date">${e[0]}</div><h3>${e[1]}</h3><div class="muted">${e[2]}</div><br><button class="outline-btn" onclick="adminEditEvent(${i})">Edit</button> <button class="outline-btn" onclick="adminDeleteEvent(${i})">Delete</button></div></div>`).join('')}</div>`;
 else if(p==='gallery') c.innerHTML=`<div class="hero"><div><h2>Photo Gallery</h2><div class="muted">Create folders such as Society Meeting, Park Activity and Festival Activity.</div></div><button class="primary-btn" onclick="adminAddGalleryFolder()">+ New Folder</button></div><div class="gallery-grid">${demo.gallery.map((g,i)=>`<div class="card"><div class="photo">▧</div><div class="card-body"><strong>${g}</strong><div class="muted">Folder</div><br><button class="outline-btn" onclick="adminUploadGallery(${i})">Upload Photos</button></div></div>`).join('')}</div>`;
 else if(p==='members') c.innerHTML=`<div class="hero"><div><h2>Members</h2><div class="muted">Add, edit or remove society members.</div></div><button class="primary-btn" onclick="adminAddMember()">+ Add Member</button></div><div class="panel"><table class="table"><thead><tr><th>Member</th><th>House</th><th>Status</th><th>Action</th></tr></thead><tbody>${demo.members.map((m,i)=>`<tr><td><strong>${m[1]}</strong></td><td>${m[2]}</td><td><span class="status ongoing">Active</span></td><td><button class="outline-btn" onclick="adminEditMember(${i})">Edit</button> <button class="outline-btn" onclick="adminDeleteMember(${i})">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
 else if(p==='complaints') c.innerHTML=`<div class="hero"><div><h2>Complaints</h2><div class="muted">Review and update member complaints.</div></div></div><div class="panel"><table class="table"><thead><tr><th>ID</th><th>Category</th><th>Status</th><th>Action</th></tr></thead><tbody><tr><td>#DE-1042</td><td>Street Light</td><td><span class="status ongoing">In Progress</span></td><td><button class="outline-btn" onclick="adminUpdateComplaint()">Update</button></td></tr></tbody></table></div>`;
 else if(p==='map') c.innerHTML=`<div class="hero"><div><h2>Society Map</h2><div class="muted">Upload or replace the society map PDF.</div></div></div><div class="panel"><label>Society Map PDF<input id="mapPdf" type="file" accept="application/pdf"></label><br><button class="primary-btn" onclick="adminUploadMap()">Upload / Replace PDF</button><div class="muted" style="margin-top:10px">${window.__societyMapName?'Selected: '+window.__societyMapName:'No map selected'}</div></div>`;
 window.__adminUser=user;
}
function openMemberDashboard(user){document.getElementById('public').classList.add('hidden');const app=document.getElementById('memberApp');app.className='app-shell';app.innerHTML=`<aside class="sidebar"><div class="brand"><div class="brand-mark">DE</div><div><strong>Defense Enclave</strong><span>Member Portal</span></div></div><nav><button class="nav-item active" data-p="dash">⌂ <span>Dashboard</span></button><button class="nav-item" data-p="profile">♙ <span>My Profile</span></button><button class="nav-item" data-p="complaints">⚑ <span>Complaints</span></button><button class="nav-item" data-p="work">▣ <span>Society Work</span></button><button class="nav-item" data-p="events">◷ <span>Events</span></button><button class="nav-item" data-p="gallery">▧ <span>Gallery</span></button><button class="nav-item" data-p="public">↩ <span>Public Site</span></button></nav><div class="sidebar-bottom"><div class="user-mini"><div class="avatar">${(user.name||'A J').split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><strong>${user.name||'Member'}</strong><span>${user.house_no||'Member'}</span></div></div><button class="outline-btn" id="memberLogout">Log out</button></div></aside><main class="main"><header class="topbar"><div><div class="eyebrow">DEFENSE ENCLAVE SOCIETY</div><h1 id="memberTitle">Member Dashboard</h1></div><div class="top-actions"><button class="icon-btn" id="memberTour">?</button><div class="avatar">${(user.name||'A J').split(' ').map(x=>x[0]).slice(0,2).join('')}</div></div></header><section id="memberContent" class="content"></section></main>`;const nav=app.querySelector('nav');nav.onclick=e=>{const b=e.target.closest('.nav-item');if(!b)return;if(b.dataset.p==='public'){app.classList.add('hidden');document.getElementById('public').classList.remove('hidden');return}memberPage(b.dataset.p,user)};document.getElementById('memberLogout').onclick=async()=>{if(sb){const {error}=await sb.auth.signOut();if(error)return toast(error.message)}app.classList.add('hidden');document.getElementById('public').classList.remove('hidden');toast('Logged out')};document.getElementById('memberTour').onclick=()=>toast('Tour: dashboard → profile → complaints → work → events → gallery');memberPage('dash',user)}
function memberPage(p,user){const c=document.getElementById('memberContent'),t=document.getElementById('memberTitle');document.querySelectorAll('#memberApp .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.p===p));t.textContent={dash:'Member Dashboard',profile:'My Profile',complaints:'Complaints',work:'Society Work',events:'Events',gallery:'Photo Gallery'}[p];if(p==='dash')c.innerHTML=`<div class="hero"><div><div class="eyebrow">WELCOME BACK</div><h2>Good afternoon, ${user.name||'Member'}!</h2><div class="muted">Your society financial and activity overview.</div></div><button class="primary-btn" id="newComplaint">+ New Complaint</button></div><div class="stats">${[['Society Fund','₹18,42,500','Current balance'],['Total Expenses','₹6,84,250','This year'],['Active Maintenance','₹2,48,000','12 active items'],['Pending Tasks','17','Needs attention']].map(x=>`<div class="stat"><div class="stat-head">${x[0]}<span>●</span></div><div class="value">${x[1]}</div><div class="trend">${x[2]}</div></div>`).join('')}</div><div class="grid-2"><div class="panel"><div class="panel-head"><h3>Society Expenses — Last 6 Months</h3><span class="muted">₹ thousands</span></div><div class="chart">${[86,112,74,138,121,154].map(v=>`<div class="bar" style="height:${v*1.12}px"><span>${v}</span></div>`).join('')}</div><div class="months"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div></div><div class="panel"><h3>Expense Breakdown</h3><div class="donut-wrap"><div class="donut"></div><div class="legend"><div>● Maintenance 40%</div><div>● Security 25%</div><div>● Utilities 20%</div><div>● Other 15%</div></div></div></div></div><div class="grid-2-equal" style="margin-top:16px"><div class="panel"><h3>Recent Activity</h3><div class="activity"><div class="activity-item"><div class="activity-icon">₹</div><div><strong>Maintenance payment recorded</strong><p>Block B · ₹12,500 · 2 hours ago</p></div></div><div class="activity-item"><div class="activity-icon">✓</div><div><strong>Street light complaint updated</strong><p>Complaint #DE-1042 · In Progress</p></div></div><div class="activity-item"><div class="activity-icon">⚑</div><div><strong>New society announcement</strong><p>Monthly meeting notice · Today</p></div></div></div></div><div class="panel"><h3>Monthly Overview</h3><p class="muted">Revenue ₹3.42L · Expenses ₹1.54L</p><div class="progress"><i style="width:45%"></i></div><p class="muted">45% of monthly collection used</p></div></div>`;else if(p==='profile')c.innerHTML=`<div class="hero"><div><h2>My Profile</h2><div class="muted">Your registered society information.</div></div></div><div class="panel"><div class="form-grid"><label>Name<input value="${user.name||''}" id="profileName"></label><label>Email<input value="${user.email||''}" readonly></label><label>House / Flat<input value="${user.house_no||''}" id="profileHouse"></label><label>Phone<input placeholder="Phone number"></label></div><label>Address<textarea>${user.address||''}</textarea></label><button class="primary-btn" onclick="toast('Profile saved in demo mode')">Save Profile</button></div>`;else if(p==='complaints')c.innerHTML=`<div class="hero"><div><h2>My Complaints</h2><div class="muted">Submit and track society issues.</div></div><button class="primary-btn" id="newComplaint">+ New Complaint</button></div><div class="panel"><table class="table"><thead><tr><th>ID</th><th>Category</th><th>Complaint</th><th>Status</th><th>Date</th></tr></thead><tbody>${demo.works.slice(0,3).map((w,i)=>`<tr><td>#DE-10${42-i}</td><td>${['Street Light','Cleanliness','Water'][i]}</td><td>${w[1]}</td><td><span class="status ${i===1?'completed':i===0?'ongoing':'pending'}">${i===1?'Resolved':i===0?'In Progress':'Submitted'}</span></td><td>15 Sep 2026</td></tr>`).join('')}</tbody></table></div>`;else if(p==='work')c.innerHTML=`<div class="hero"><div><h2>Society Work</h2><div class="muted">Transparent project progress.</div></div></div><div class="panel"><table class="table"><thead><tr><th>Project</th><th>Status</th><th>Progress</th><th>Target</th></tr></thead><tbody>${demo.works.map(w=>`<tr><td><strong>${w[0]}</strong><br><span class="muted">${w[1]}</span></td><td><span class="status ${w[2].toLowerCase()}">${w[2]}</span></td><td><div class="progress"><i style="width:${w[3]}%"></i></div>${w[3]}%</td><td>${w[4]}</td></tr>`).join('')}</tbody></table></div>`;else if(p==='events')c.innerHTML=`<div class="hero"><div><h2>Events</h2><div class="muted">Upcoming society events.</div></div></div><div class="event-grid">${demo.events.map(e=>`<div class="card"><div class="photo">${e[3]}</div><div class="card-body"><div class="event-date">${e[0]}</div><h3>${e[1]}</h3><div class="muted">${e[2]}</div></div></div>`).join('')}</div>`;else if(p==='gallery')c.innerHTML=`<div class="hero"><div><h2>Photo Gallery</h2><div class="muted">Community moments.</div></div></div><div class="gallery-grid">${demo.gallery.map((g,i)=>`<div class="card"><div class="photo">${['◉','★','♧','✦','✓','◎'][i]}</div><div class="card-body"><strong>${g}</strong></div></div>`).join('')}</div>`;document.getElementById('newComplaint')?.addEventListener('click',()=>toast('Complaint form is ready; database connection will persist it in production.'))}
