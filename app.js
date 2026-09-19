/* Defense Enclave Admin Login Fix: 2026-09-19 */
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
    const result = await sb
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

    if (result.error) {
        console.error('Profile loading error:', result.error);
        await sb.auth.signOut();
        return toast('Unable to load your profile. Please contact the society administrator.');
    }

    const profile = result.data;

    if (!profile) {
        console.error('Profile not found for user:', data.user.id);
        await sb.auth.signOut();
        return toast('Profile not found. Please contact the society administrator.');
    }

    if (!profile.role) {
        console.error('User role is missing:', profile);
        await sb.auth.signOut();
        return toast('User role is not configured.');
    }

    const user = {
        ...data.user,
        name: profile.full_name ||
              data.user.user_metadata?.full_name ||
              data.user.email?.split('@')[0] ||
              'Member',
        email: data.user.email || '',
        phone: profile.phone || '',
        house_no: profile.house_number || profile.house_no || '',
        address: profile.address || '',
        role: String(profile.role).toLowerCase().trim()
    };

    console.log('LOGIN PROFILE:', profile);
    console.log('LOGIN ROLE:', user.role);

    authModal.classList.add('hidden');

    if (user.role === 'admin') {
        console.log('Opening ADMIN dashboard');
        window.__adminUser = user;
        openAdminDashboard(user);
    } else {
        console.log('Opening MEMBER dashboard');
        openMemberDashboard(user);
    }

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
function adminPage(p,user){
 const c=document.getElementById('adminContent'),t=document.getElementById('adminTitle');
 document.querySelectorAll('#memberApp .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.a===p));
 const titles={dashboard:'Admin Dashboard',finance:'Society Finance',maintenance:'Active Maintenance',work:'Society Work',events:'Events',gallery:'Photo Gallery',members:'Members',complaints:'Complaints',map:'Society Map'}; t.textContent=titles[p]||'Admin Dashboard';
 if(p==='dashboard') c.innerHTML=`<div class="hero"><div><div class="eyebrow">ADMINISTRATION</div><h2>Welcome, ${user.name}</h2><div class="muted">Manage Defense Enclave Society information from one place.</div></div></div><div class="stats"><div class="stat"><div class="stat-head">Society Fund<span>●</span></div><div class="value">₹18,42,500</div><div class="trend">Manage in Finance</div></div><div class="stat"><div class="stat-head">Total Expenses<span>●</span></div><div class="value">₹6,84,250</div><div class="trend">Manage expenses</div></div><div class="stat"><div class="stat-head">Active Maintenance<span>●</span></div><div class="value">₹2,48,000</div><div class="trend">Manage maintenance</div></div><div class="stat"><div class="stat-head">Pending Tasks<span>●</span></div><div class="value">17</div><div class="trend">Review society work</div></div></div><div class="grid-2-equal"><div class="panel"><h3>Management</h3><div class="activity"><div class="activity-item"><div class="activity-icon">₹</div><div><strong>Society Finance</strong><p>Update fund, expenses and maintenance.</p></div></div><div class="activity-item"><div class="activity-icon">♙</div><div><strong>Members</strong><p>Add, edit and manage society members.</p></div></div><div class="activity-item"><div class="activity-icon">▧</div><div><strong>Gallery</strong><p>Manage photo categories and uploads.</p></div></div></div></div><div class="panel"><h3>Quick actions</h3><div class="form-grid"><button class="primary-btn" onclick="adminPage('finance',window.__adminUser)">Manage Finance</button><button class="primary-btn" onclick="adminPage('members',window.__adminUser)">Manage Members</button><button class="primary-btn" onclick="adminPage('events',window.__adminUser)">Manage Events</button><button class="primary-btn" onclick="adminPage('gallery',window.__adminUser)">Manage Gallery</button></div></div></div>`;
 else if(p==='finance') c.innerHTML=`<div class="hero"><div><h2>Society Finance</h2><div class="muted">Update the values displayed to members.</div></div></div><div class="panel"><div class="form-grid"><label>Society Fund<input id="adminFund" type="number" value="1842500"></label><label>Total Expenses<input id="adminExpenses" type="number" value="684250"></label><label>Active Maintenance<input id="adminMaintenance" type="number" value="248000"></label><label>Pending Tasks<input id="adminPending" type="number" value="17"></label></div><button class="primary-btn" onclick="toast('Finance UI ready. Database save will be connected next.')">Save Finance</button></div>`;
 else if(p==='maintenance') c.innerHTML=`<div class="hero"><div><h2>Active Maintenance</h2><div class="muted">Manage active maintenance expenses.</div></div><button class="primary-btn" onclick="toast('Add maintenance form will be connected to Supabase next.')">+ Add Maintenance</button></div><div class="panel"><table class="table"><thead><tr><th>Item</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody><tr><td>Street Light Repair</td><td>₹45,000</td><td><span class="status ongoing">Active</span></td><td><button class="outline-btn" onclick="toast('Edit ready')">Edit</button></td></tr><tr><td>Park Maintenance</td><td>₹80,000</td><td><span class="status ongoing">Active</span></td><td><button class="outline-btn" onclick="toast('Edit ready')">Edit</button></td></tr></tbody></table></div>`;
 else if(p==='work') c.innerHTML=`<div class="hero"><div><h2>Society Work</h2><div class="muted">Ongoing, pending and completed projects.</div></div><button class="primary-btn" onclick="toast('Add work form will be connected to Supabase next.')">+ Add Work</button></div><div class="panel"><table class="table"><thead><tr><th>Project</th><th>Status</th><th>Progress</th><th>Target</th><th>Action</th></tr></thead><tbody>${demo.works.map(w=>`<tr><td><strong>${w[0]}</strong><br><span class="muted">${w[1]}</span></td><td><span class="status ${w[2].toLowerCase()}">${w[2]}</span></td><td>${w[3]}%</td><td>${w[4]}</td><td><button class="outline-btn" onclick="toast('Edit ready')">Edit</button></td></tr>`).join('')}</tbody></table></div>`;
 else if(p==='events') c.innerHTML=`<div class="hero"><div><h2>Events</h2><div class="muted">Add, edit or delete society events.</div></div><button class="primary-btn" onclick="toast('Event form will be connected to Supabase next.')">+ Add Event</button></div><div class="event-grid">${demo.events.map(e=>`<div class="card"><div class="photo">${e[3]}</div><div class="card-body"><div class="event-date">${e[0]}</div><h3>${e[1]}</h3><div class="muted">${e[2]}</div><br><button class="outline-btn" onclick="toast('Edit ready')">Edit</button> <button class="outline-btn" onclick="toast('Delete ready')">Delete</button></div></div>`).join('')}</div>`;
 else if(p==='gallery') c.innerHTML=`<div class="hero"><div><h2>Photo Gallery</h2><div class="muted">Create folders such as Society Meeting, Park Activity and Festival Activity.</div></div><button class="primary-btn" onclick="toast('Folder creation will be connected to Supabase Storage next.')">+ New Folder</button></div><div class="gallery-grid">${demo.gallery.map(g=>`<div class="card"><div class="photo">▧</div><div class="card-body"><strong>${g}</strong><div class="muted">Folder</div><br><button class="outline-btn" onclick="toast('Upload photo ready')">Upload Photos</button></div></div>`).join('')}</div>`;
 else if(p==='members') c.innerHTML=`<div class="hero"><div><h2>Members</h2><div class="muted">Add, edit or remove society members.</div></div><button class="primary-btn" onclick="toast('Add member form will be connected to Supabase next.')">+ Add Member</button></div><div class="panel"><table class="table"><thead><tr><th>Member</th><th>House</th><th>Status</th><th>Action</th></tr></thead><tbody>${demo.members.map(m=>`<tr><td><strong>${m[1]}</strong></td><td>${m[2]}</td><td><span class="status ongoing">Active</span></td><td><button class="outline-btn" onclick="toast('Edit ready')">Edit</button> <button class="outline-btn" onclick="toast('Delete ready')">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
 else if(p==='complaints') c.innerHTML=`<div class="hero"><div><h2>Complaints</h2><div class="muted">Review and update member complaints.</div></div></div><div class="panel"><table class="table"><thead><tr><th>ID</th><th>Category</th><th>Status</th><th>Action</th></tr></thead><tbody><tr><td>#DE-1042</td><td>Street Light</td><td><span class="status ongoing">In Progress</span></td><td><button class="outline-btn" onclick="toast('Complaint update ready')">Update</button></td></tr></tbody></table></div>`;
 else if(p==='map') c.innerHTML=`<div class="hero"><div><h2>Society Map</h2><div class="muted">Upload or replace the society map PDF.</div></div></div><div class="panel"><label>Society Map PDF<input id="mapPdf" type="file" accept="application/pdf"></label><br><button class="primary-btn" onclick="toast('PDF upload will be connected to Supabase Storage next.')">Upload / Replace PDF</button></div>`;
 window.__adminUser=user;
}
function openMemberDashboard(user){document.getElementById('public').classList.add('hidden');const app=document.getElementById('memberApp');app.className='app-shell';app.innerHTML=`<aside class="sidebar"><div class="brand"><div class="brand-mark">DE</div><div><strong>Defense Enclave</strong><span>Member Portal</span></div></div><nav><button class="nav-item active" data-p="dash">⌂ <span>Dashboard</span></button><button class="nav-item" data-p="profile">♙ <span>My Profile</span></button><button class="nav-item" data-p="complaints">⚑ <span>Complaints</span></button><button class="nav-item" data-p="work">▣ <span>Society Work</span></button><button class="nav-item" data-p="events">◷ <span>Events</span></button><button class="nav-item" data-p="gallery">▧ <span>Gallery</span></button><button class="nav-item" data-p="public">↩ <span>Public Site</span></button></nav><div class="sidebar-bottom"><div class="user-mini"><div class="avatar">${(user.name||'A J').split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><strong>${user.name||'Member'}</strong><span>${user.house_no||'Member'}</span></div></div><button class="outline-btn" id="memberLogout">Log out</button></div></aside><main class="main"><header class="topbar"><div><div class="eyebrow">DEFENSE ENCLAVE SOCIETY</div><h1 id="memberTitle">Member Dashboard</h1></div><div class="top-actions"><button class="icon-btn" id="memberTour">?</button><div class="avatar">${(user.name||'A J').split(' ').map(x=>x[0]).slice(0,2).join('')}</div></div></header><section id="memberContent" class="content"></section></main>`;const nav=app.querySelector('nav');nav.onclick=e=>{const b=e.target.closest('.nav-item');if(!b)return;if(b.dataset.p==='public'){app.classList.add('hidden');document.getElementById('public').classList.remove('hidden');return}memberPage(b.dataset.p,user)};document.getElementById('memberLogout').onclick=async()=>{if(sb){const {error}=await sb.auth.signOut();if(error)return toast(error.message)}app.classList.add('hidden');document.getElementById('public').classList.remove('hidden');toast('Logged out')};document.getElementById('memberTour').onclick=()=>toast('Tour: dashboard → profile → complaints → work → events → gallery');memberPage('dash',user)}
function memberPage(p,user){const c=document.getElementById('memberContent'),t=document.getElementById('memberTitle');document.querySelectorAll('#memberApp .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.p===p));t.textContent={dash:'Member Dashboard',profile:'My Profile',complaints:'Complaints',work:'Society Work',events:'Events',gallery:'Photo Gallery'}[p];if(p==='dash')c.innerHTML=`<div class="hero"><div><div class="eyebrow">WELCOME BACK</div><h2>Good afternoon, ${user.name||'Member'}!</h2><div class="muted">Your society financial and activity overview.</div></div><button class="primary-btn" id="newComplaint">+ New Complaint</button></div><div class="stats">${[['Society Fund','₹18,42,500','Current balance'],['Total Expenses','₹6,84,250','This year'],['Active Maintenance','₹2,48,000','12 active items'],['Pending Tasks','17','Needs attention']].map(x=>`<div class="stat"><div class="stat-head">${x[0]}<span>●</span></div><div class="value">${x[1]}</div><div class="trend">${x[2]}</div></div>`).join('')}</div><div class="grid-2"><div class="panel"><div class="panel-head"><h3>Society Expenses — Last 6 Months</h3><span class="muted">₹ thousands</span></div><div class="chart">${[86,112,74,138,121,154].map(v=>`<div class="bar" style="height:${v*1.12}px"><span>${v}</span></div>`).join('')}</div><div class="months"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div></div><div class="panel"><h3>Expense Breakdown</h3><div class="donut-wrap"><div class="donut"></div><div class="legend"><div>● Maintenance 40%</div><div>● Security 25%</div><div>● Utilities 20%</div><div>● Other 15%</div></div></div></div></div><div class="grid-2-equal" style="margin-top:16px"><div class="panel"><h3>Recent Activity</h3><div class="activity"><div class="activity-item"><div class="activity-icon">₹</div><div><strong>Maintenance payment recorded</strong><p>Block B · ₹12,500 · 2 hours ago</p></div></div><div class="activity-item"><div class="activity-icon">✓</div><div><strong>Street light complaint updated</strong><p>Complaint #DE-1042 · In Progress</p></div></div><div class="activity-item"><div class="activity-icon">⚑</div><div><strong>New society announcement</strong><p>Monthly meeting notice · Today</p></div></div></div></div><div class="panel"><h3>Monthly Overview</h3><p class="muted">Revenue ₹3.42L · Expenses ₹1.54L</p><div class="progress"><i style="width:45%"></i></div><p class="muted">45% of monthly collection used</p></div></div>`;else if(p==='profile')c.innerHTML=`<div class="hero"><div><h2>My Profile</h2><div class="muted">Your registered society information.</div></div></div><div class="panel"><div class="form-grid"><label>Name<input value="${user.name||''}" id="profileName"></label><label>Email<input value="${user.email||''}" readonly></label><label>House / Flat<input value="${user.house_no||''}" id="profileHouse"></label><label>Phone<input placeholder="Phone number"></label></div><label>Address<textarea>${user.address||''}</textarea></label><button class="primary-btn" onclick="toast('Profile saved in demo mode')">Save Profile</button></div>`;else if(p==='complaints')c.innerHTML=`<div class="hero"><div><h2>My Complaints</h2><div class="muted">Submit and track society issues.</div></div><button class="primary-btn" id="newComplaint">+ New Complaint</button></div><div class="panel"><table class="table"><thead><tr><th>ID</th><th>Category</th><th>Complaint</th><th>Status</th><th>Date</th></tr></thead><tbody>${demo.works.slice(0,3).map((w,i)=>`<tr><td>#DE-10${42-i}</td><td>${['Street Light','Cleanliness','Water'][i]}</td><td>${w[1]}</td><td><span class="status ${i===1?'completed':i===0?'ongoing':'pending'}">${i===1?'Resolved':i===0?'In Progress':'Submitted'}</span></td><td>15 Sep 2026</td></tr>`).join('')}</tbody></table></div>`;else if(p==='work')c.innerHTML=`<div class="hero"><div><h2>Society Work</h2><div class="muted">Transparent project progress.</div></div></div><div class="panel"><table class="table"><thead><tr><th>Project</th><th>Status</th><th>Progress</th><th>Target</th></tr></thead><tbody>${demo.works.map(w=>`<tr><td><strong>${w[0]}</strong><br><span class="muted">${w[1]}</span></td><td><span class="status ${w[2].toLowerCase()}">${w[2]}</span></td><td><div class="progress"><i style="width:${w[3]}%"></i></div>${w[3]}%</td><td>${w[4]}</td></tr>`).join('')}</tbody></table></div>`;else if(p==='events')c.innerHTML=`<div class="hero"><div><h2>Events</h2><div class="muted">Upcoming society events.</div></div></div><div class="event-grid">${demo.events.map(e=>`<div class="card"><div class="photo">${e[3]}</div><div class="card-body"><div class="event-date">${e[0]}</div><h3>${e[1]}</h3><div class="muted">${e[2]}</div></div></div>`).join('')}</div>`;else if(p==='gallery')c.innerHTML=`<div class="hero"><div><h2>Photo Gallery</h2><div class="muted">Community moments.</div></div></div><div class="gallery-grid">${demo.gallery.map((g,i)=>`<div class="card"><div class="photo">${['◉','★','♧','✦','✓','◎'][i]}</div><div class="card-body"><strong>${g}</strong></div></div>`).join('')}</div>`;document.getElementById('newComplaint')?.addEventListener('click',()=>toast('Complaint form is ready; database connection will persist it in production.'))}
