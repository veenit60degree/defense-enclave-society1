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

const demo={members:[['RS','Raj Sharma','A-101'],['PK','Priya Kapoor','A-102'],['MG','Manoj Gupta','A-103'],['AJ','Alex Johnson','A-104'],['SK','Sonia Kaur','B-201'],['VS','Vikas Singh','B-202'],['AM','Anita Mehta','B-203'],['NK','Nitin Kumar','C-301'],['PS','Pooja Sethi','C-302']],works:[['Main Gate Repair','Repair and repaint main entrance gate','Ongoing',72,'12 Sep 2026'],['Street Light Upgrade','Replace 18 old lights with LED fixtures','Ongoing',45,'18 Sep 2026'],['Park Renovation','Benches, pathway and plantation work','Pending',0,'25 Sep 2026'],['Water Tank Cleaning','Annual cleaning and inspection','Completed',100,'05 Sep 2026']],events:[['20 Sep 2026','Monthly General Meeting','Community Hall · 6:00 PM','◷'],['02 Oct 2026','Cleanliness Drive','Main Park · 7:00 AM','♧'],['18 Oct 2026','Family Sports Day','Society Ground · 4:00 PM','★']],gallery:['Society Meeting','Park Activity','Festival Evening','Cleanliness Drive','Community Gathering']};
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
async function renderPublic(){
    let finance={
        society_fund:1842500,
        total_expenses:684250,
        active_maintenance:248000,
        pending_tasks:17
    };

    if(sb){
        try{
            const {data,error}=await sb.from('society_finance')
                .select('society_fund,total_expenses,active_maintenance,pending_tasks')
                .eq('id',1)
                .maybeSingle();

            if(error) console.error('Public finance load error:',error);
            if(data) finance=data;
        }catch(e){
            console.error('Public finance load exception:',e);
        }
    }

    document.getElementById('publicStats').innerHTML=[
        ['Society Fund',`₹${Number(finance.society_fund||0).toLocaleString('en-IN')}`,'Current balance'],
        ['Total Expenses',`₹${Number(finance.total_expenses||0).toLocaleString('en-IN')}`,'This year'],
        ['Active Maintenance',`₹${Number(finance.active_maintenance||0).toLocaleString('en-IN')}`,'Active maintenance'],
        ['Pending Tasks',String(Number(finance.pending_tasks||0)),'Needs attention']
    ].map(x=>`<div class="stat"><div class="stat-head">${x[0]}<span>●</span></div><div class="value">${x[1]}</div><div class="trend">${x[2]}</div></div>`).join('');

    document.getElementById('memberGrid').innerHTML=demo.members.map(p=>`<div class="member-card"><div class="member-photo">${p[0]}</div><div><strong>${p[1]}</strong><div class="muted">House ${p[2]}</div><span class="status ongoing" style="margin-top:6px">Active Member</span></div></div>`).join('');

    document.getElementById('workTable').innerHTML=`<thead><tr><th>Project</th><th>Description</th><th>Status</th><th>Progress</th><th>Target</th></tr></thead><tbody>${demo.works.map(w=>`<tr><td><strong>${w[0]}</strong></td><td>${w[1]}</td><td><span class="status ${w[2].toLowerCase()}">${w[2]}</span></td><td><div class="progress"><i style="width:${w[3]}%"></i></div>${w[3]}%</td><td>${w[4]}</td></tr>`).join('')}</tbody>`;

    document.getElementById('eventGrid').innerHTML=demo.events.map(e=>`<div class="card"><div class="photo">${e[3]}</div><div class="card-body"><div class="event-date">${e[0]}</div><h3>${e[1]}</h3><div class="muted">${e[2]}</div></div></div>`).join('');

    document.getElementById('galleryGrid').innerHTML=demo.gallery.map((g,i)=>`<div class="card"><div class="photo">${['◉','★','♧','✦','✓','◎'][i%6]}</div><div class="card-body"><strong>${g}</strong><div class="muted" style="margin-top:5px">Gallery folder</div></div></div>`).join('');
}
renderPublic().catch(e=>console.error('Initial public render:',e));
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
    await renderPublic();
}

async function adminAddMaintenance(){
    if(!sb)return toast('Supabase is not configured.');
    const item=prompt('Maintenance item name:'); if(!item)return;
    const amount=prompt('Amount:','0'); if(amount===null)return;
    const status=prompt('Status (Active/Pending/Completed):','Active')||'Active';
    const {error}=await sb.from('maintenance').insert({item,amount:Number(amount)||0,status});
    if(error)return toast('Maintenance save failed: '+error.message);
    toast('Maintenance added'); await adminPage('maintenance',window.__adminUser);
}

async function adminEditMaintenance(i){
    const x=window.__maintenanceRows?.[i]; if(!x)return;
    const item=prompt('Maintenance item:',x.item||x.title||x.name||''); if(item===null)return;
    const amount=prompt('Amount:',x.amount||0); if(amount===null)return;
    const status=prompt('Status:',x.status||''); if(status===null)return;
    const {error}=await sb.from('maintenance').update({item,amount:Number(amount)||0,status}).eq('id',x.id);
    if(error)return toast('Update failed: '+error.message);
    toast('Maintenance updated'); await adminPage('maintenance',window.__adminUser);
}

async function adminDeleteMaintenance(i){
    const x=window.__maintenanceRows?.[i]; if(!x)return;
    if(!confirm('Delete this maintenance item?'))return;
    const {error}=await sb.from('maintenance').delete().eq('id',x.id);
    if(error)return toast('Delete failed: '+error.message);
    toast('Maintenance deleted'); await adminPage('maintenance',window.__adminUser);
}

async function adminAddWork(){
 if(!sb)return toast('Supabase is not configured.');
 const name=prompt('Work / project name:'); if(!name)return;
 const description=prompt('Description:','')||'';
 const status=prompt('Status (Ongoing/Pending/Completed):','Pending')||'Pending';
 const progress=Math.max(0,Math.min(100,Number(prompt('Progress %:','0'))||0));
 const target_date=prompt('Target date:','')||null;
 const {error}=await sb.from('society_work').insert({name,description,status,progress,target_date});
 if(error)return toast('Work save failed: '+error.message);
 toast('Work saved successfully'); await adminPage('work',window.__adminUser);
}

async function adminEditWork(i){
 const x=window.__workRows?.[i]; if(!x)return;
 const name=prompt('Work / project name:',x.name||x.title||x.project_name||''); if(name===null)return;
 const description=prompt('Description:',x.description||''); if(description===null)return;
 const status=prompt('Status:',x.status||''); if(status===null)return;
 const progress=Math.max(0,Math.min(100,Number(prompt('Progress %:',x.progress||0))||0));
 const target_date=prompt('Target date:',x.target_date||x.target||''); if(target_date===null)return;
 const {error}=await sb.from('society_work').update({name,description,status,progress,target_date}).eq('id',x.id);
 if(error)return toast('Work update failed: '+error.message);
 toast('Work updated'); await adminPage('work',window.__adminUser);
}

async function adminAddEvent(){
 if(!sb)return toast('Supabase is not configured.');
 const event_date=prompt('Event date:',''); if(!event_date)return;
 const title=prompt('Event title:'); if(!title)return;
 const location=prompt('Location / time:','')||'';
 const description=prompt('Description:','')||'';
 const {error}=await sb.from('events').insert({event_date,title,location,description});
 if(error)return toast('Event save failed: '+error.message);
 toast('Event saved successfully'); await adminPage('events',window.__adminUser);
}

async function adminEditEvent(i){
 const x=window.__eventRows?.[i]; if(!x)return;
 const event_date=prompt('Event date:',x.event_date||x.date||''); if(event_date===null)return;
 const title=prompt('Event title:',x.title||x.name||''); if(title===null)return;
 const location=prompt('Location / time:',x.location||x.place||''); if(location===null)return;
 const description=prompt('Description:',x.description||''); if(description===null)return;
 const {error}=await sb.from('events').update({event_date,title,location,description}).eq('id',x.id);
 if(error)return toast('Event update failed: '+error.message);
 toast('Event updated'); await adminPage('events',window.__adminUser);
}

async function adminDeleteEvent(i){
 const x=window.__eventRows?.[i]; if(!x||!confirm('Delete this event?'))return;
 const {error}=await sb.from('events').delete().eq('id',x.id);
 if(error)return toast('Event delete failed: '+error.message);
 toast('Event deleted'); await adminPage('events',window.__adminUser);
}

async function adminListGalleryFolders(){
 if(!sb)return [];
 try{
  const {data,error}=await sb.storage.from('society-gallery').list('',{limit:1000,sortBy:{column:'name',order:'asc'}});
  if(error){ console.error('Gallery folder list error:',error); return []; }
  return (data||[])
    .filter(x => x && x.name && !x.name.includes('.'))
    .map(x => x.name);
 }catch(e){
  console.error('Gallery folder list exception:',e);
  return [];
 }
}

async function adminAddGalleryFolder(){
 if(!sb)return toast('Supabase is not configured.');
 const name=prompt('Gallery folder name:');
 if(!name)return;
 const folder=String(name).trim().replace(/[\/\\]+/g,'-');
 if(!folder)return;

 try{
  const {data:existing,error}=await sb.storage.from('society-gallery').list(folder,{limit:1});
  if(error)return toast('Gallery folder check failed: '+error.message);
  if((existing||[]).length)return toast('Folder already exists.');

  // Supabase Storage creates folders implicitly when a file is uploaded.
  // Store a tiny hidden marker so an empty folder can still exist.
  const marker=new Blob(['gallery-folder'],{type:'text/plain'});
  const {error:uploadError}=await sb.storage
    .from('society-gallery')
    .upload(`${folder}/.folder`,marker,{upsert:false,contentType:'text/plain'});

  if(uploadError)return toast('Gallery folder save failed: '+uploadError.message);

  toast(`Gallery folder "${folder}" created successfully.`);
  await adminPage('gallery',window.__adminUser);
 }catch(e){
  console.error('Gallery folder create error:',e);
  toast('Gallery folder save failed: '+(e?.message||e));
 }
}

async function adminUploadGallery(folderName){
 if(!sb)return toast('Supabase is not configured.');
 if(typeof folderName!=='string' || !folderName.trim())return toast('Gallery folder not found.');

 const input=document.createElement('input');
 input.type='file';
 input.accept='image/*';
 input.multiple=true;

 input.onchange=async()=>{
  const files=Array.from(input.files||[]);
  if(!files.length)return;

  let saved=0,failed=0;

  for(const file of files){
   let storagePath=null;
   try{
    const folder=folderName.trim().replace(/[\/\\]+/g,'-').replace(/[^a-zA-Z0-9 _-]+/g,'_');
    const ext=(file.name.split('.').pop()||'jpg').toLowerCase();
    const base=(file.name.replace(/\.[^/.]+$/,'').replace(/[^a-zA-Z0-9 _-]+/g,'_')||'photo');
    const storageName=`${Date.now()}_${Math.random().toString(36).slice(2,10)}_${base}.${ext}`;
    storagePath=`${folder}/${storageName}`;

    const upload=await sb.storage
      .from('society-gallery')
      .upload(storagePath,file,{
        cacheControl:'3600',
        upsert:false,
        contentType:file.type||'image/jpeg'
      });

    if(upload.error)throw upload.error;

    const {data:urlData}=sb.storage.from('society-gallery').getPublicUrl(storagePath);
    const publicUrl=urlData?.publicUrl||'';

    // Do NOT use folder_name: the current gallery_photos table does not have that column.
    const db=await sb.from('gallery_photos').insert({
      file_name:file.name,
      storage_path:storagePath,
      public_url:publicUrl
    });

    if(db.error)throw db.error;
    saved++;
   }catch(e){
    console.error('Gallery photo save error:',e);
    if(storagePath){
      try{ await sb.storage.from('society-gallery').remove([storagePath]); }catch(_){}
    }
    failed++;
   }
  }

  if(!saved)return toast('No photo saved. Check gallery storage/table policies.');
  toast(`${saved} photo(s) saved${failed?`, ${failed} failed`:''}`);
  await adminPage('gallery',window.__adminUser);
 };
 input.click();
}
async function adminAddMember(){
 if(!sb)return toast('Supabase is not configured.');
 const name=prompt('Member name:'); if(!name)return;
 const house_number=prompt('House / Flat number:','')||'';
 const phone=prompt('Phone:','')||'';
 const address=prompt('Address:','')||'';
 const {error}=await sb.from('profiles').insert({full_name:name,house_number,phone,address,role:'member'});
 if(error)return toast('Member save failed: '+error.message);
 toast('Member saved successfully'); await adminPage('members',window.__adminUser);
}

async function adminEditMember(i){
 const x=window.__memberRows?.[i]; if(!x)return;
 const full_name=prompt('Member name:',x.full_name||x.name||''); if(full_name===null)return;
 const house_number=prompt('House / Flat:',x.house_number||x.house_no||''); if(house_number===null)return;
 const phone=prompt('Phone:',x.phone||''); if(phone===null)return;
 const address=prompt('Address:',x.address||''); if(address===null)return;
 const role=prompt('Role:',x.role||'member'); if(role===null)return;
 const {error}=await sb.from('profiles').update({full_name,house_number,phone,address,role}).eq('id',x.id);
 if(error)return toast('Member update failed: '+error.message);
 toast('Member updated'); await adminPage('members',window.__adminUser);
}

async function adminDeleteMember(i){
 const x=window.__memberRows?.[i]; if(!x||!confirm('Remove this member?'))return;
 const {error}=await sb.from('profiles').delete().eq('id',x.id);
 if(error)return toast('Member delete failed: '+error.message);
 toast('Member removed'); await adminPage('members',window.__adminUser);
}

async function adminUpdateComplaint(i){
 const x=window.__complaintRows?.[i]; if(!x)return;
 const status=prompt('Complaint status:',x.status||'In Progress'); if(status===null)return;
 const {error}=await sb.from('complaints').update({status}).eq('id',x.id);
 if(error)return toast('Complaint update failed: '+error.message);
 toast('Complaint updated'); await adminPage('complaints',window.__adminUser);
}

async function adminUploadMap(){
 if(!sb)return toast('Supabase is not configured.');
 const input=document.getElementById('mapPdf'),file=input?.files?.[0];
 if(!file)return toast('Please select a PDF first.');
 if(file.type!=='application/pdf')return toast('Only PDF files are allowed.');
 if(file.size>10*1024*1024)return toast('PDF must be 10 MB or smaller.');

 try{
  // Store the PDF in the existing public Supabase bucket.
  const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
  const storagePath=`society-map/${Date.now()}_${safeName}`;

  const upload=await sb.storage
    .from('society-documents')
    .upload(storagePath,file,{upsert:true,contentType:'application/pdf'});

  if(upload.error)throw upload.error;

  const {data:urlData}=sb.storage
    .from('society-documents')
    .getPublicUrl(storagePath);

  const publicUrl=urlData?.publicUrl||'';
  if(!publicUrl)throw new Error('Could not create the public PDF URL.');

  // IMPORTANT: society_map does NOT have a storage_path column.
  // Save only the columns used by the current table.
  const payload={
    id:1,
    file_name:file.name,
    public_url:publicUrl,
    updated_at:new Date().toISOString()
  };

  const {data:existing,error:readError}=await sb
    .from('society_map')
    .select('id')
    .eq('id',1)
    .maybeSingle();

  if(readError)throw readError;

  let saveError=null;

  if(existing){
    const result=await sb
      .from('society_map')
      .update({
        file_name:payload.file_name,
        public_url:payload.public_url,
        updated_at:payload.updated_at
      })
      .eq('id',1);
    saveError=result.error;
  }else{
    const result=await sb
      .from('society_map')
      .insert(payload);
    saveError=result.error;
  }

  if(saveError)throw saveError;

  toast('Society Map saved successfully');
  await adminPage('map',window.__adminUser);
 }catch(e){
  console.error('Map upload error:',e);
  toast('Map save failed: '+(e?.message||'Unknown error'));
 }
}

async function adminPage(p,user){
 const c=document.getElementById('adminContent'),t=document.getElementById('adminTitle');
 document.querySelectorAll('#memberApp .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.a===p));
 const titles={dashboard:'Admin Dashboard',finance:'Society Finance',maintenance:'Active Maintenance',work:'Society Work',events:'Events',gallery:'Photo Gallery',members:'Members',complaints:'Complaints',map:'Society Map'}; t.textContent=titles[p]||'Admin Dashboard';
 if(p==='dashboard'){
  if(!sb)return toast('Supabase is not configured.');
  const {data:f,error}=await sb.from('society_finance').select('*').eq('id',1).maybeSingle();
  if(error)return toast('Unable to load Dashboard: '+error.message);
  const v=f||{society_fund:0,total_expenses:0,active_maintenance:0,pending_tasks:0};
  c.innerHTML=`<div class="hero"><div><div class="eyebrow">ADMINISTRATION</div><h2>Welcome, ${user.name||'Admin'}</h2><div class="muted">All values are loaded from saved database data.</div></div></div>
  <div class="stats">
  <div class="stat"><div class="stat-head">Society Fund<span>●</span></div><div class="value">₹${Number(v.society_fund||0).toLocaleString('en-IN')}</div><div class="trend">Database value</div></div>
  <div class="stat"><div class="stat-head">Total Expenses<span>●</span></div><div class="value">₹${Number(v.total_expenses||0).toLocaleString('en-IN')}</div><div class="trend">Database value</div></div>
  <div class="stat"><div class="stat-head">Active Maintenance<span>●</span></div><div class="value">₹${Number(v.active_maintenance||0).toLocaleString('en-IN')}</div><div class="trend">Database value</div></div>
  <div class="stat"><div class="stat-head">Pending Tasks<span>●</span></div><div class="value">${Number(v.pending_tasks||0)}</div><div class="trend">Database value</div></div></div>
  <div class="grid-2-equal"><div class="panel"><h3>Management</h3><div class="muted">Use the sections below to manage saved society records.</div></div>
  <div class="panel"><h3>Quick actions</h3><div class="form-grid">
  <button class="primary-btn" onclick="adminPage('finance',window.__adminUser)">Finance</button>
  <button class="primary-btn" onclick="adminPage('maintenance',window.__adminUser)">Maintenance</button>
  <button class="primary-btn" onclick="adminPage('work',window.__adminUser)">Society Work</button>
  <button class="primary-btn" onclick="adminPage('events',window.__adminUser)">Events</button>
  <button class="primary-btn" onclick="adminPage('gallery',window.__adminUser)">Gallery</button>
  <button class="primary-btn" onclick="adminPage('members',window.__adminUser)">Members</button>
  <button class="primary-btn" onclick="adminPage('complaints',window.__adminUser)">Complaints</button>
  <button class="primary-btn" onclick="adminPage('map',window.__adminUser)">Society Map</button>
  </div></div></div>`;
}
 else if(p==='finance'){
  const {data:f,error}=await sb.from('society_finance').select('*').eq('id',1).maybeSingle();
  if(error)return toast('Unable to load Finance: '+error.message);
  const v=f||{society_fund:0,total_expenses:0,active_maintenance:0,pending_tasks:0};
  c.innerHTML=`<div class="hero"><div><h2>Society Finance</h2><div class="muted">Only saved database values are shown.</div></div></div>
  <div class="panel"><div class="form-grid">
  <label>Society Fund<input id="adminFund" type="number" min="0" value="${Number(v.society_fund)||0}"></label>
  <label>Total Expenses<input id="adminExpenses" type="number" min="0" value="${Number(v.total_expenses)||0}"></label>
  <label>Active Maintenance<input id="adminMaintenance" type="number" min="0" value="${Number(v.active_maintenance)||0}"></label>
  <label>Pending Tasks<input id="adminPending" type="number" min="0" value="${Number(v.pending_tasks)||0}"></label></div>
  <div style="margin-top:16px"><button class="primary-btn" onclick="saveFinance()">Save Finance</button></div></div>`;
}
else if(p==='maintenance'){
    const {data:rows,error}=await sb.from('maintenance').select('*').order('created_at',{ascending:false});
    if(error){ console.error('Maintenance load error:',error); return toast('Unable to load Maintenance: '+error.message); }
    window.__maintenanceRows=rows||[];
    c.innerHTML=`<div class="hero"><div><h2>Active Maintenance</h2><div class="muted">Showing only records saved in the database.</div></div><button class="primary-btn" onclick="adminAddMaintenance()">+ Add Maintenance</button></div>
    <div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>Item</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>
    ${(rows||[]).map((x,i)=>`<tr><td><strong>${x.item||x.title||x.name||''}</strong>${x.description?`<br><span class="muted">${x.description}</span>`:''}</td><td>₹${Number(x.amount||0).toLocaleString('en-IN')}</td><td>${x.status||''}</td><td><button class="outline-btn" onclick="adminEditMaintenance(${i})">Edit</button> <button class="outline-btn" onclick="adminDeleteMaintenance(${i})">Delete</button></td></tr>`).join('')}
    </tbody></table></div>${rows?.length?'':`<div class="muted" style="padding:18px">No maintenance records saved yet.</div>`}</div>`;
}else if(p==='work'){
    const {data:rows,error}=await sb.from('society_work').select('*').order('created_at',{ascending:false});
    if(error){ console.error('Society Work load error:',error); return toast('Unable to load Society Work: '+error.message); }
    window.__workRows=rows||[];
    c.innerHTML=`<div class="hero"><div><h2>Society Work</h2><div class="muted">Showing only records saved in the database.</div></div><button class="primary-btn" onclick="adminAddWork()">+ Add Work</button></div>
    <div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>Project</th><th>Description</th><th>Status</th><th>Progress</th><th>Target</th><th>Action</th></tr></thead><tbody>
    ${(rows||[]).map((x,i)=>`<tr><td><strong>${x.name||x.title||x.project_name||''}</strong></td><td>${x.description||''}</td><td>${x.status||''}</td><td>${Number(x.progress||0)}%</td><td>${x.target_date||x.target||''}</td><td><button class="outline-btn" onclick="adminEditWork(${i})">Edit</button></td></tr>`).join('')}
    </tbody></table></div>${rows?.length?'':`<div class="muted" style="padding:18px">No society work records saved yet.</div>`}</div>`;
}else if(p==='events'){
    const {data:rows,error}=await sb.from('events').select('*').order('event_date',{ascending:false});
    if(error){ console.error('Events load error:',error); return toast('Unable to load Events: '+error.message); }
    window.__eventRows=rows||[];
    c.innerHTML=`<div class="hero"><div><h2>Events</h2><div class="muted">Showing only events saved in the database.</div></div><button class="primary-btn" onclick="adminAddEvent()">+ Add Event</button></div>
    <div class="event-grid">${(rows||[]).map((x,i)=>`<div class="card"><div class="photo">📅</div><div class="card-body"><div class="event-date">${x.event_date||x.date||''}</div><h3>${x.title||x.name||''}</h3><div class="muted">${x.location||x.place||x.description||''}</div><br><button class="outline-btn" onclick="adminEditEvent(${i})">Edit</button> <button class="outline-btn" onclick="adminDeleteEvent(${i})">Delete</button></div></div>`).join('')}</div>${rows?.length?'':`<div class="panel"><div class="muted">No events saved yet.</div></div>`}`;
 }else if(p==='gallery'){
    const {data:rows,error}=await sb.from('gallery_photos').select('*');
    if(error){ console.error('Gallery load error:',error); return toast('Unable to load Gallery: '+error.message); }

    // The current gallery_photos table does not contain folder_name.
    // Folder is derived from the first segment of storage_path.
    const normalizedRows=(rows||[]).map(x=>{
      const path=String(x.storage_path||'').replace(/^\/+/,'');
      const parts=path.split('/');
      return {...x,_folder:parts.length>1?parts[0]:'General'};
    });

    // Also include empty folders created through Storage (.folder marker).
    const storageFolders=await adminListGalleryFolders();
    const folders=[...new Set([
      ...storageFolders,
      ...normalizedRows.map(x=>x._folder).filter(Boolean)
    ])].filter(Boolean).sort((a,b)=>a.localeCompare(b));

    window.__galleryRows=normalizedRows;

    c.innerHTML=`<div class="hero"><div><h2>Photo Gallery</h2><div class="muted">Only saved Supabase Gallery photos are shown.</div></div></div>
    <div class="panel"><button class="primary-btn" onclick="adminAddGalleryFolder()">+ Add Folder</button></div>
    <div class="gallery-grid">${folders.map(folder=>{
      const photos=normalizedRows.filter(x=>x._folder===folder && x.file_name!=='.folder');
      return `<div class="card"><div class="card-body"><h3>${folder}</h3><div class="muted">${photos.length} saved photo(s)</div>
      <button class="outline-btn" onclick='adminUploadGallery(${JSON.stringify(folder)})'>Add Photos</button>
      <div class="gallery-grid" style="margin-top:12px">${photos.map(x=>`<div><img src="${x.public_url||''}" alt="${x.file_name||''}" style="width:100%;height:180px;object-fit:cover;border-radius:10px"><div class="muted">${x.file_name||''}</div></div>`).join('')}</div>
      </div></div>`;
    }).join('')}</div>${folders.length?'':`<div class="panel"><div class="muted">No gallery folders or photos saved yet.</div></div>`}`;
}else if(p==='members'){
    const {data:rows,error}=await sb.from('profiles').select('*').order('created_at',{ascending:false});
    if(error){ console.error('Members load error:',error); return toast('Unable to load Members: '+error.message); }
    window.__memberRows=rows||[];
    c.innerHTML=`<div class="hero"><div><h2>Members</h2><div class="muted">Showing only member profiles saved in the database.</div></div><button class="primary-btn" onclick="adminAddMember()">+ Add Member</button></div>
    <div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>Member</th><th>House</th><th>Phone</th><th>Role</th><th>Action</th></tr></thead><tbody>
    ${(rows||[]).map((x,i)=>`<tr><td><strong>${x.full_name||x.name||x.email||''}</strong><br><span class="muted">${x.email||''}</span></td><td>${x.house_number||x.house_no||''}</td><td>${x.phone||''}</td><td>${x.role||'member'}</td><td><button class="outline-btn" onclick="adminEditMember(${i})">Edit</button> <button class="outline-btn" onclick="adminDeleteMember(${i})">Delete</button></td></tr>`).join('')}
    </tbody></table></div>${rows?.length?'':`<div class="muted" style="padding:18px">No member profiles saved yet.</div>`}</div>`;
}else if(p==='complaints'){
    const {data:rows,error}=await sb.from('complaints').select('*').order('created_at',{ascending:false});
    if(error){ console.error('Complaints load error:',error); return toast('Unable to load Complaints: '+error.message); }
    window.__complaintRows=rows||[];
    c.innerHTML=`<div class="hero"><div><h2>Complaints</h2><div class="muted">Showing only complaints saved in the database.</div></div></div>
    <div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Category</th><th>Complaint</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>
    ${(rows||[]).map((x,i)=>`<tr><td>${x.complaint_no||x.ticket_no||x.id||''}</td><td>${x.category||''}</td><td>${x.subject||x.title||x.description||x.message||''}</td><td>${x.status||''}</td><td>${x.created_at?new Date(x.created_at).toLocaleDateString('en-IN'):''}</td><td><button class="outline-btn" onclick="adminUpdateComplaint(${i})">Update</button></td></tr>`).join('')}
    </tbody></table></div>${rows?.length?'':`<div class="muted" style="padding:18px">No complaints saved yet.</div>`}</div>`;
}else if(p==='map'){
    const {data:rows,error}=await sb.from('society_map').select('*').limit(1);
    if(error){ console.error('Society Map load error:',error); return toast('Unable to load Society Map: '+error.message); }
    const map=rows?.[0];
    window.__societyMap=map||null;
    c.innerHTML=`<div class="hero"><div><h2>Society Map</h2><div class="muted">Showing only the Society Map saved in the database.</div></div></div>
    <div class="panel"><label>Society Map PDF<input id="mapPdf" type="file" accept="application/pdf"></label><br><button class="primary-btn" onclick="adminUploadMap()">Upload / Replace PDF</button>${map?.public_url?`<div style="margin-top:16px"><iframe src="${map.public_url}" style="width:100%;height:700px;border:0"></iframe></div><div style="margin-top:10px"><a href="${map.public_url}" target="_blank">Open saved Society Map PDF</a></div>`:`<div class="muted" style="margin-top:16px">No Society Map saved yet.</div>`}</div>`;
}
}
function openMemberDashboard(user){document.getElementById('public').classList.add('hidden');const app=document.getElementById('memberApp');app.className='app-shell';app.innerHTML=`<aside class="sidebar"><div class="brand"><div class="brand-mark">DE</div><div><strong>Defense Enclave</strong><span>Member Portal</span></div></div><nav><button class="nav-item active" data-p="dash">⌂ <span>Dashboard</span></button><button class="nav-item" data-p="profile">♙ <span>My Profile</span></button><button class="nav-item" data-p="complaints">⚑ <span>Complaints</span></button><button class="nav-item" data-p="work">▣ <span>Society Work</span></button><button class="nav-item" data-p="events">◷ <span>Events</span></button><button class="nav-item" data-p="gallery">▧ <span>Gallery</span></button><button class="nav-item" data-p="public">↩ <span>Public Site</span></button></nav><div class="sidebar-bottom"><div class="user-mini"><div class="avatar">${(user.name||'A J').split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><strong>${user.name||'Member'}</strong><span>${user.house_no||'Member'}</span></div></div><button class="outline-btn" id="memberLogout">Log out</button></div></aside><main class="main"><header class="topbar"><div><div class="eyebrow">DEFENSE ENCLAVE SOCIETY</div><h1 id="memberTitle">Member Dashboard</h1></div><div class="top-actions"><button class="icon-btn" id="memberTour">?</button><div class="avatar">${(user.name||'A J').split(' ').map(x=>x[0]).slice(0,2).join('')}</div></div></header><section id="memberContent" class="content"></section></main>`;const nav=app.querySelector('nav');nav.onclick=e=>{const b=e.target.closest('.nav-item');if(!b)return;if(b.dataset.p==='public'){app.classList.add('hidden');document.getElementById('public').classList.remove('hidden');return}memberPage(b.dataset.p,user)};document.getElementById('memberLogout').onclick=async()=>{if(sb){const {error}=await sb.auth.signOut();if(error)return toast(error.message)}app.classList.add('hidden');document.getElementById('public').classList.remove('hidden');toast('Logged out')};document.getElementById('memberTour').onclick=()=>toast('Tour: dashboard → profile → complaints → work → events → gallery');memberPage('dash',user)}
function memberPage(p,user){const c=document.getElementById('memberContent'),t=document.getElementById('memberTitle');document.querySelectorAll('#memberApp .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.p===p));t.textContent={dash:'Member Dashboard',profile:'My Profile',complaints:'Complaints',work:'Society Work',events:'Events',gallery:'Photo Gallery'}[p];if(p==='dash')c.innerHTML=`<div class="hero"><div><div class="eyebrow">WELCOME BACK</div><h2>Good afternoon, ${user.name||'Member'}!</h2><div class="muted">Your society financial and activity overview.</div></div><button class="primary-btn" id="newComplaint">+ New Complaint</button></div><div class="stats">${[['Society Fund','₹18,42,500','Current balance'],['Total Expenses','₹6,84,250','This year'],['Active Maintenance','₹2,48,000','12 active items'],['Pending Tasks','17','Needs attention']].map(x=>`<div class="stat"><div class="stat-head">${x[0]}<span>●</span></div><div class="value">${x[1]}</div><div class="trend">${x[2]}</div></div>`).join('')}</div><div class="grid-2"><div class="panel"><div class="panel-head"><h3>Society Expenses — Last 6 Months</h3><span class="muted">₹ thousands</span></div><div class="chart">${[86,112,74,138,121,154].map(v=>`<div class="bar" style="height:${v*1.12}px"><span>${v}</span></div>`).join('')}</div><div class="months"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div></div><div class="panel"><h3>Expense Breakdown</h3><div class="donut-wrap"><div class="donut"></div><div class="legend"><div>● Maintenance 40%</div><div>● Security 25%</div><div>● Utilities 20%</div><div>● Other 15%</div></div></div></div></div><div class="grid-2-equal" style="margin-top:16px"><div class="panel"><h3>Recent Activity</h3><div class="activity"><div class="activity-item"><div class="activity-icon">₹</div><div><strong>Maintenance payment recorded</strong><p>Block B · ₹12,500 · 2 hours ago</p></div></div><div class="activity-item"><div class="activity-icon">✓</div><div><strong>Street light complaint updated</strong><p>Complaint #DE-1042 · In Progress</p></div></div><div class="activity-item"><div class="activity-icon">⚑</div><div><strong>New society announcement</strong><p>Monthly meeting notice · Today</p></div></div></div></div><div class="panel"><h3>Monthly Overview</h3><p class="muted">Revenue ₹3.42L · Expenses ₹1.54L</p><div class="progress"><i style="width:45%"></i></div><p class="muted">45% of monthly collection used</p></div></div>`;else if(p==='profile')c.innerHTML=`<div class="hero"><div><h2>My Profile</h2><div class="muted">Your registered society information.</div></div></div><div class="panel"><div class="form-grid"><label>Name<input value="${user.name||''}" id="profileName"></label><label>Email<input value="${user.email||''}" readonly></label><label>House / Flat<input value="${user.house_no||''}" id="profileHouse"></label><label>Phone<input placeholder="Phone number"></label></div><label>Address<textarea>${user.address||''}</textarea></label><button class="primary-btn" onclick="toast('Profile saved in demo mode')">Save Profile</button></div>`;else if(p==='complaints')c.innerHTML=`<div class="hero"><div><h2>My Complaints</h2><div class="muted">Submit and track society issues.</div></div><button class="primary-btn" id="newComplaint">+ New Complaint</button></div><div class="panel"><table class="table"><thead><tr><th>ID</th><th>Category</th><th>Complaint</th><th>Status</th><th>Date</th></tr></thead><tbody>${demo.works.slice(0,3).map((w,i)=>`<tr><td>#DE-10${42-i}</td><td>${['Street Light','Cleanliness','Water'][i]}</td><td>${w[1]}</td><td><span class="status ${i===1?'completed':i===0?'ongoing':'pending'}">${i===1?'Resolved':i===0?'In Progress':'Submitted'}</span></td><td>15 Sep 2026</td></tr>`).join('')}</tbody></table></div>`;else if(p==='work')c.innerHTML=`<div class="hero"><div><h2>Society Work</h2><div class="muted">Transparent project progress.</div></div></div><div class="panel"><table class="table"><thead><tr><th>Project</th><th>Status</th><th>Progress</th><th>Target</th></tr></thead><tbody>${demo.works.map(w=>`<tr><td><strong>${w[0]}</strong><br><span class="muted">${w[1]}</span></td><td><span class="status ${w[2].toLowerCase()}">${w[2]}</span></td><td><div class="progress"><i style="width:${w[3]}%"></i></div>${w[3]}%</td><td>${w[4]}</td></tr>`).join('')}</tbody></table></div>`;else if(p==='events')c.innerHTML=`<div class="hero"><div><h2>Events</h2><div class="muted">Upcoming society events.</div></div></div><div class="event-grid">${demo.events.map(e=>`<div class="card"><div class="photo">${e[3]}</div><div class="card-body"><div class="event-date">${e[0]}</div><h3>${e[1]}</h3><div class="muted">${e[2]}</div></div></div>`).join('')}</div>`;else if(p==='gallery')c.innerHTML=`<div class="hero"><div><h2>Photo Gallery</h2><div class="muted">Community moments.</div></div></div><div class="gallery-grid">${demo.gallery.map((g,i)=>`<div class="card"><div class="photo">${['◉','★','♧','✦','✓','◎'][i]}</div><div class="card-body"><strong>${g}</strong></div></div>`).join('')}</div>`;document.getElementById('newComplaint')?.addEventListener('click',()=>toast('Complaint form is ready; database connection will persist it in production.'))}


/* ============================================================
   PERSISTENT LOGIN SESSION RESTORATION
   ============================================================ */
async function restoreLoginSession(){
    if(!sb || !sb.auth) return;

    try{
        const {data,error}=await sb.auth.getSession();

        if(error){
            console.error('Session restore error:',error);
            return;
        }

        const authUser=data?.session?.user;
        if(!authUser) return;

        const {data:profile,error:profileError}=await sb
            .from('profiles')
            .select('*')
            .eq('id',authUser.id)
            .maybeSingle();

        if(profileError){
            console.error('Profile restore error:',profileError);
            return;
        }

        if(!profile){
            console.error('Profile not found:',authUser.id);
            return;
        }

        const user={
            ...authUser,
            name:profile.full_name ||
                 authUser.user_metadata?.full_name ||
                 authUser.email?.split('@')[0] || 'Member',
            email:authUser.email||'',
            phone:profile.phone||'',
            house_no:profile.house_number||profile.house_no||'',
            address:profile.address||'',
            role:(profile.role||'member').toLowerCase()
        };

        window.__adminUser=user;

        document.getElementById('authModal')?.classList.add('hidden');
        document.getElementById('authOverlay')?.classList.add('hidden');

        if(user.role==='admin'){
            await openAdminDashboard(user);
        }else{
            await openMemberDashboard(user);
        }

        console.log('Login session restored:',user.email,user.role);
    }catch(e){
        console.error('Session restoration failed:',e);
    }
}

setTimeout(()=>restoreLoginSession(),300);

if(sb && sb.auth){
    sb.auth.onAuthStateChange((event)=>{
        console.log('Supabase auth event:',event);

        if(event==='SIGNED_OUT'){
            window.__adminUser=null;
            document.getElementById('memberApp')?.classList.add('hidden');
            document.getElementById('public')?.classList.remove('hidden');
            renderPublic().catch(e=>console.error('Public refresh:',e));
        }
    });
}
