
const complaintEscapedValue = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

/* Defense Enclave Admin Buttons: 2026-09-19 */
//const CONFIG={SUPABASE_URL:'https://gujtekpteezejmtaxtcj.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_KvdsKcUr_vuvPrg7xU11Ww_q1H7vhg1'};

// Use one Supabase client only. Multiple GoTrueClient instances sharing the
// same browser storage can cause session synchronization problems.
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
function publicSectionByHeading(labels){
    const wanted=(labels||[]).map(x=>String(x).trim().toLowerCase());
    const nodes=[...document.querySelectorAll('section,article,.section,.panel,main > div,body > div')];
    return nodes.find(node=>{
        const h=node.querySelector('h1,h2,h3,h4,.section-title,.eyebrow');
        const text=(h?.textContent||'').trim().toLowerCase();
        return wanted.some(x=>text===x || text.includes(x));
    })||null;
}

function publicContentContainer(labels, preferredSelectors=[]){
    const section=publicSectionByHeading(labels);
    if(!section)return null;
    for(const selector of preferredSelectors){
        const el=section.querySelector(selector);
        if(el)return el;
    }
    // Reuse the existing section and only create a content holder inside it.
    // This does NOT create another section/layout.
    let holder=section.querySelector('[data-public-dynamic-content]');
    if(!holder){
        holder=document.createElement('div');
        holder.setAttribute('data-public-dynamic-content','1');
        section.appendChild(holder);
    }
    return holder;
}

function escapePublic(v){
    return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}


/* ===== CURRENT PUBLIC UI FIXES ===== */
function publicFormGroupFor(id){
    const el=document.getElementById(id);
    if(!el)return null;

    // Find the smallest useful wrapper containing only this field.
    // This works with both the original two-column form and the current
    // responsive public form without changing the existing HTML layout.
    let node=el;
    let best=el.parentElement||el;
    while(node && node.parentElement){
        const parent=node.parentElement;
        if(parent.id==='authRegister' || parent.id==='authModal' || parent.tagName==='FORM') break;
        const controls=[...parent.querySelectorAll('input,textarea,select')]
            .filter(x=>x.id);
        if(controls.length===1 && controls[0].id===id){
            best=parent;
            node=parent;
            continue;
        }
        if(controls.length>1)break;
        node=parent;
    }
    return best;
}

function createPublicConfirmPasswordField(register,passwordEl){
    if(!register)return null;

    let existing=document.getElementById('regConfirmPassword');
    if(existing)return publicFormGroupFor('regConfirmPassword');

    const passwordGroup=publicFormGroupFor('regPassword');
    if(!passwordGroup)return null;

    const group=document.createElement('div');
    group.setAttribute('data-public-confirm-password-group','1');
    group.style.marginBottom='15px';
    group.innerHTML=`
      <label for="regConfirmPassword" style="display:block;font-weight:600;margin-bottom:6px;">
        Confirm Password <span style="color:#d92d20;">*</span>
      </label>
      <div style="position:relative;">
        <input id="regConfirmPassword" type="password" minlength="6" maxlength="72"
          placeholder="Re-enter password"
          style="width:100%;box-sizing:border-box;padding:11px 70px 11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <button type="button" id="regConfirmPasswordToggle"
          style="position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:none;color:#475467;font-weight:600;cursor:pointer;padding:4px 6px;">
          Show
        </button>
      </div>
      <div id="regConfirmPasswordError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>`;

    passwordGroup.parentElement.insertBefore(group,passwordGroup.nextSibling);

    const input=group.querySelector('#regConfirmPassword');
    const toggle=group.querySelector('#regConfirmPasswordToggle');
    toggle.onclick=()=>{
        const show=input.type==='password';
        input.type=show?'text':'password';
        toggle.textContent=show?'Hide':'Show';
    };

    return group;
}

function fixPublicMemberForm(){
    const register=document.getElementById('authRegister');
    if(!register)return;

    // Keep the existing form and existing fields. Only arrange the fields in
    // the requested order and create Confirm Password if the attached page
    // does not already contain it.
    const getGroup=id=>publicFormGroupFor(id);
    const nameGroup=getGroup('regName');
    const phoneGroup=getGroup('regPhone');
    const emailGroup=getGroup('regEmail');
    const houseGroup=getGroup('regHouse');
    const passwordGroup=getGroup('regPassword');

    let confirmGroup=getGroup('regConfirmPassword') || getGroup('memberConfirmPassword');
    if(!confirmGroup)confirmGroup=createPublicConfirmPasswordField(register,document.getElementById('regPassword'));

    const photoEl=[...register.querySelectorAll('input[type="file"]')].find(x=>{
        const label=register.querySelector(`label[for="${CSS.escape(x.id||'')}" ]`);
        return /profile\s*photo|photo/i.test(label?.textContent||'');
    }) || register.querySelector('input[type="file"]');
    const photoGroup=photoEl ? publicFormGroupFor(photoEl.id) : null;
    const addressGroup=getGroup('regAddress');

    // Reuse the existing form's layout container. Move only field groups;
    // no duplicate sections or dialogs are created.
    const groups=[nameGroup,phoneGroup,emailGroup,houseGroup,passwordGroup,confirmGroup,photoGroup,addressGroup]
        .filter((x,i,a)=>x && a.indexOf(x)===i);

    if(groups.length){
        const parent=groups[0].parentElement;
        if(parent && groups.every(x=>x.parentElement===parent)){
            groups.forEach(x=>parent.appendChild(x));
        }else{
            // If the original form uses nested/grid wrappers, place each group
            // immediately after the previous requested group.
            for(let i=1;i<groups.length;i++){
                const previous=groups[i-1];
                const current=groups[i];
                if(previous?.parentElement===current?.parentElement){
                    previous.parentElement.insertBefore(current,previous.nextSibling);
                }
            }
        }
    }

    // Ensure Confirm Password is immediately after Password even when the
    // form uses a grid wrapper.
    if(confirmGroup && passwordGroup && passwordGroup.parentElement===confirmGroup.parentElement){
        passwordGroup.parentElement.insertBefore(confirmGroup,passwordGroup.nextSibling);
    }

    // Address must be after Profile Photo. If there is no photo field,
    // address is placed after Confirm Password.
    const afterGroup=photoGroup||confirmGroup;
    if(addressGroup && afterGroup && addressGroup.parentElement===afterGroup.parentElement){
        afterGroup.parentElement.insertBefore(addressGroup,afterGroup.nextSibling);
    }

    // Add/repair show-hide controls without replacing the existing password.
    const addToggle=(inputId,toggleId)=>{
        const input=document.getElementById(inputId);
        if(!input)return;
        let toggle=document.getElementById(toggleId);
        if(!toggle){
            const wrap=input.parentElement;
            if(!wrap)return;
            wrap.style.position='relative';
            toggle=document.createElement('button');
            toggle.type='button';
            toggle.id=toggleId;
            toggle.textContent='Show';
            toggle.style.cssText='position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:none;color:#475467;font-weight:600;cursor:pointer;padding:4px 6px;';
            wrap.appendChild(toggle);
        }
        toggle.onclick=()=>{
            const show=input.type==='password';
            input.type=show?'text':'password';
            toggle.textContent=show?'Hide':'Show';
        };
    };
    addToggle('regPassword','regPasswordToggle');
    addToggle('regConfirmPassword','regConfirmPasswordToggle');

    // Inner vertical scrolling for the popup.
    const candidates=[
        register.closest('.modal-body'),
        register.closest('.modal-content'),
        register.closest('[role="dialog"]'),
        register.parentElement
    ].filter(Boolean);
    const scrollHost=candidates.find(x=>x.contains(register))||register;
    scrollHost.style.maxHeight='calc(100vh - 100px)';
    scrollHost.style.overflowY='auto';
    scrollHost.style.overflowX='hidden';
    scrollHost.style.webkitOverflowScrolling='touch';

    // Supabase is configured in this file, so hide the old demo/configuration
    // notice if it exists in the attached page.
  
}

function addPublicMembersViewAll(section,members){
    if(!section)return;
    const heading=section.querySelector('h1,h2,h3,h4') || Array.from(section.children).find(x=>/^society members$/i.test((x.textContent||'').trim()));
    if(!heading)return;

    let link=heading.querySelector('[data-public-members-view-all]');
    if(!link){
        link=document.createElement('button');
        link.type='button';
        link.setAttribute('data-public-members-view-all','1');
        link.textContent='(View all)';
        link.style.cssText='margin-left:8px;border:0;background:none;padding:0;color:#079c79;font:inherit;font-size:.82em;font-weight:600;cursor:pointer;text-decoration:none;vertical-align:baseline;';
        heading.appendChild(link);
    }

    link.onclick=()=>openPublicMembersPage(members);
}

function openPublicMembersPage(members){
    const old=document.getElementById('publicMembersAllOverlay');
    if(old)old.remove();

    const rows=Array.isArray(members)?members:[];
    const overlay=document.createElement('div');
    overlay.id='publicMembersAllOverlay';
    overlay.style.cssText='position:fixed;inset:0;background:rgba(245,249,250,.98);z-index:99998;overflow:auto;padding:24px;box-sizing:border-box;';
    overlay.innerHTML=`<div style="max-width:1100px;margin:0 auto;background:#fff;border-radius:16px;padding:24px;box-sizing:border-box;box-shadow:0 12px 40px rgba(0,0,0,.12)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px">
            <h2 style="margin:0">Society Members</h2>
            <button type="button" id="publicMembersAllClose" style="border:0;background:none;font-size:28px;cursor:pointer;line-height:1">×</button>
        </div>
        <div class="public-all-members-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px">
            ${rows.map(p=>{
                const initials=(p.full_name||'M').split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
                const address=[p.house_number,p.address].filter(Boolean).join(', ');
                return `<div class="member-card"><div class="member-photo">${escapePublic(initials)}</div><div><strong>${escapePublic(p.full_name||'Member')}</strong><div class="muted">${escapePublic(p.phone||'Phone not available')}</div><div class="muted">${escapePublic(address||'Address not available')}</div></div></div>`;
            }).join('') || '<div class="muted">No registered members found.</div>'}
        </div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#publicMembersAllClose').onclick=()=>overlay.remove();
}

async function renderPublic(){
      const complaintEscapedValue=value=>String(value??'')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
      function complaintEscapedValue(v){
  return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
    if(!sb){
        console.warn('Public render: Supabase client is not available.');
        return;
    }

    const [members,works,events,gallery,maintenance,about]=await Promise.all([
        sb.from('profiles').select('id,full_name,phone,house_number,address,role,is_active').eq('role','member').eq('is_active',true),
        sb.from('society_work').select('*').order('created_at',{ascending:false}),
        sb.from('events').select('*').order('event_date',{ascending:false}),
        sb.from('gallery_photos').select('*').order('created_at',{ascending:false}),
        sb.from('maintenance').select('*').order('created_at',{ascending:false}),
        sb.from('society_about').select('*').eq('id',1).maybeSingle()
    ]);

    console.log('[PUBLIC] members:',members.data,'error:',members.error);
    console.log('[PUBLIC] events:',events.data,'error:',events.error);
    console.log('[PUBLIC] gallery:',gallery.data,'error:',gallery.error);
    console.log('[PUBLIC] maintenance:',maintenance.data,'error:',maintenance.error);
    console.log('[PUBLIC] about:',about.data,'error:',about.error);

    // Always reuse the already-rendered public sections. No new sections are created.
    const memberSection=publicSectionByHeading(['Society Members']);
    const memberGrid=document.getElementById('memberGrid') ||
        publicContentContainer(['Society Members'],['.member-grid','.members-grid','.cards-grid','.grid-3']);
    if(memberGrid){
        if(members.error){
            memberGrid.innerHTML='<div class="muted">Unable to load members.</div>';
        }else{
            const memberRows=members.data||[];
            memberGrid.innerHTML=memberRows.map(p=>{
                const initials=(p.full_name||'M').split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
                const address=[p.house_number,p.address].filter(Boolean).join(', ');
                return `<div class="member-card"><div class="member-photo">${escapePublic(initials)}</div><div><strong>${escapePublic(p.full_name||'Member')}</strong><div class="muted">${escapePublic(p.phone||'Phone not available')}</div><div class="muted">${escapePublic(address||'Address not available')}</div></div></div>`;
            }).join('') || '<div class="muted">No registered members found.</div>';

            // Public/logout page: keep the existing member section and make only its
            // member list internally scrollable. Four rows fit before scrolling.
            memberGrid.style.maxHeight='420px';
            memberGrid.style.overflowY='auto';
            memberGrid.style.overflowX='hidden';
            memberGrid.style.paddingRight='6px';
            memberGrid.style.webkitOverflowScrolling='touch';
            addPublicMembersViewAll(memberSection,memberRows);
        }
    }

    const workTable=document.getElementById('workTable') ||
        publicContentContainer(['Society Work'],['.work-table','.table-wrap table']);
    if(workTable && !works.error && works.data){
        const rows=works.data;
        if(workTable.tagName==='TABLE'){
            workTable.innerHTML=`<thead><tr><th>Project</th><th>Description</th><th>Status</th><th>Progress</th><th>Target</th></tr></thead><tbody>${rows.map(w=>{
                const name=w.name||w.title||w.work_name||w.project_name||w.work_title||w.project||w.work||w.activity||w.task||w.subject||'';
                return `<tr><td><strong>${escapePublic(name)}</strong></td><td>${escapePublic(w.description||w.details||'')}</td><td>${escapePublic(w.status||'')}</td><td>${Number(w.progress||0)}%</td><td>${escapePublic(w.target_date||w.target||w.due_date||'')}</td></tr>`;
            }).join('')}</tbody>`;
        }
    }

    const eventGrid=document.getElementById('eventGrid') ||
        publicContentContainer(['Events'],['.event-grid','.events-grid','.cards-grid']);
    if(eventGrid){
        if(events.error){
            eventGrid.innerHTML='<div class="muted">Unable to load events.</div>';
        }else{
            eventGrid.innerHTML=(events.data||[]).map(e=>`<div class="card"><div class="photo">📅</div><div class="card-body"><div class="event-date">${escapePublic(e.event_date||e.date||'')}</div><h3>${escapePublic(e.title||e.name||'')}</h3><div class="muted">${escapePublic(e.location||e.place||e.description||'')}</div></div></div>`).join('') || '<div class="muted">No events available.</div>';
        }
    }

    const maintenanceGrid=document.getElementById('maintenanceGrid') ||
        publicContentContainer(['Maintenance'],['.maintenance-grid','.maintenance-list','.cards-grid','.table-wrap']);
    if(maintenanceGrid){
        maintenanceGrid.innerHTML=maintenance.error
            ? '<div class="muted">Unable to load maintenance information.</div>'
            : (maintenance.data||[]).map(x=>`<div class="card"><div class="card-body"><h3>${escapePublic(x.item||x.title||x.name||'Maintenance')}</h3><div class="muted">${escapePublic(x.description||'')}</div><div><strong>₹${Number(x.amount||0).toLocaleString('en-IN')}</strong></div><span class="status">${escapePublic(x.status||'')}</span></div></div>`).join('') || '<div class="muted">No maintenance records available.</div>';
    }

    // About Us: reuse the EXISTING About Us content/card.
    // Do not append another dynamic block below the existing layout.
    const aboutSection=publicSectionByHeading(['About Us']);
    if(aboutSection){
        // Remove any dynamic holder that an older version may have appended.
        aboutSection.querySelectorAll('[data-public-dynamic-content]').forEach(el=>el.remove());

        // Prefer the existing About content/card instead of creating a new one.
        let aboutContainer=document.getElementById('aboutContent') ||
            aboutSection.querySelector('.about-content,.about-card,.about-box,.panel,.card');

        // If the page does not use a known class, use the first direct DIV after
        // the heading as the existing content container.
        if(!aboutContainer){
            const heading=aboutSection.querySelector('h1,h2,h3,h4,.section-title,.eyebrow');
            aboutContainer=[...aboutSection.children].find(el=>
                el!==heading && el.tagName==='DIV'
            ) || null;
        }

        if(aboutContainer){
            const description=about.data?.description||about.data?.about||about.data?.content||'';
            aboutContainer.innerHTML=about.error
                ? '<div class="muted">Unable to load About Us information.</div>'
                : description
                    ? `<div class="about-description">${escapePublic(description).replace(/\n/g,'<br>')}</div>`
                    : '<div class="muted">About information is not available.</div>';
        }
    }

    // Reuse the existing .map div and put the map inside it.
    const mapDiv=document.getElementById('map') || document.querySelector('.map[data-map], .map');
    if(mapDiv){
        mapDiv.innerHTML=`<h3 style="margin:0 0 12px 0">Society Map</h3><iframe title="Defense Enclave Society location" src="https://www.google.com/maps?q=30.777604,76.616637&z=17&output=embed" width="100%" height="420" style="border:0;border-radius:14px;display:block" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    }

    // Existing Photo Gallery: albums -> thumbnails -> full-screen photo viewer.
    const gallerySection=publicSectionByHeading(['Photo Gallery','Gallery']);
    if(gallerySection){
        const galleryHeading=gallerySection.querySelector('h1,h2,h3,h4,.section-title,.eyebrow');
        if(galleryHeading && !galleryHeading.querySelector('[data-public-gallery-link]')){
            const link=document.createElement('a');
            link.href='#';
            link.textContent=' (View all photos)';
            link.setAttribute('data-public-gallery-link','1');
            link.style.cssText='font-size:.82em;font-weight:500;text-decoration:none;cursor:pointer;margin-left:4px;';
            link.addEventListener('click',e=>{
                e.preventDefault();
                const albums=window.__publicGalleryAlbums||{};
                const first=Object.keys(albums)[0];
                if(first) window.__publicGalleryOpenAlbum(first);
                else toast('No photos available.');
            });
            galleryHeading.appendChild(link);
        }
    }
    const galleryGrid=document.getElementById('galleryGrid') ||
        publicContentContainer(['Photo Gallery','Gallery'],['.gallery-grid','.photos-grid','.cards-grid']);
    if(galleryGrid){
        if(gallery.error){
            galleryGrid.innerHTML='<div class="muted">Unable to load photo gallery.</div>';
        }else{
            const rows=(gallery.data||[]).filter(x=>x.file_name!=='.folder');
            const grouped={};
            rows.forEach(x=>{
                const path=String(x.storage_path||'').replace(/^\/+/, '');
                const parts=path.split('/');
                const album=parts.length>1 ? parts[0] : 'General';
                (grouped[album] ||= []).push(x);
            });
            const albums=Object.keys(grouped).sort((a,b)=>a.localeCompare(b));
            window.__publicGalleryAlbums=grouped;
            window.__publicGalleryOpenAlbum=function(album){
                const photos=window.__publicGalleryAlbums?.[album]||[];
                const overlay=document.createElement('div');
                overlay.id='publicGalleryAlbumOverlay';
                overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:99999;overflow:auto;padding:30px;';
                overlay.innerHTML=`<div style="max-width:1100px;margin:auto;background:#fff;border-radius:16px;padding:20px"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><h2 style="margin:0">${escapePublic(album)}</h2><button id="publicGalleryAlbumClose" class="outline-btn">Close</button></div><div class="gallery-grid" style="margin-top:18px;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px">${photos.map((x,i)=>`<button type="button" class="public-gallery-thumb" data-photo-index="${i}" style="border:0;background:none;padding:0;cursor:pointer"><img src="${escapePublic(x.public_url||'')}" alt="${escapePublic(x.file_name||'Photo')}" style="width:110px;height:80px;object-fit:cover;border-radius:8px;display:block"></button>`).join('')}</div></div>`;
                document.body.appendChild(overlay);
                overlay.querySelector('#publicGalleryAlbumClose').onclick=()=>overlay.remove();
                overlay.addEventListener('click',e=>{
                    const b=e.target.closest('.public-gallery-thumb');
                    if(!b)return;
                    const photo=photos[Number(b.dataset.photoIndex)];
                    if(!photo?.public_url)return;
                    const viewer=document.createElement('div');
                    viewer.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.94);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;';
                    viewer.innerHTML=`<button id="publicGalleryPhotoClose" style="position:absolute;top:18px;right:22px;font-size:28px;color:#fff;background:none;border:0;cursor:pointer">×</button><img src="${escapePublic(photo.public_url)}" alt="${escapePublic(photo.file_name||'Photo')}" style="max-width:95vw;max-height:90vh;object-fit:contain;border-radius:8px">`;
                    document.body.appendChild(viewer);
                    viewer.querySelector('#publicGalleryPhotoClose').onclick=()=>viewer.remove();
                    viewer.onclick=e=>{if(e.target===viewer)viewer.remove();};
                });
            };
            galleryGrid.innerHTML=`${albums.map(album=>{
                const photos=grouped[album];
                const cover=photos.find(x=>x.public_url)?.public_url||'';
                return `<div class="card" style="cursor:pointer" data-public-album="${escapePublic(album)}"><div class="photo">${cover?`<img src="${escapePublic(cover)}" alt="${escapePublic(album)}" style="width:100%;height:210px;object-fit:cover">`:'<div style="height:210px;display:flex;align-items:center;justify-content:center">📷</div>'}</div><div class="card-body"><h3>${escapePublic(album)}</h3><div class="muted">${photos.length} photo${photos.length===1?'':'s'}</div></div></div>`;
            }).join('') || '<div class="muted">No photo albums available.</div>'}`;
            galleryGrid.querySelectorAll('[data-public-album]').forEach(card=>card.addEventListener('click',()=>window.__publicGalleryOpenAlbum(card.getAttribute('data-public-album'))));
        }
    }

  // Public/logout page: read-only complaint status board.
  // Requires a safe public view named public_complaint_status.
  let publicComplaintSection=document.getElementById('publicComplaintsSection');
  if(!publicComplaintSection){
    publicComplaintSection=document.createElement('section');
    publicComplaintSection.id='publicComplaintsSection';
    publicComplaintSection.className='public-section';
    const societyWork=[...document.querySelectorAll('#public h1,#public h2,#public h3')].find(el=>el.textContent.trim()==='Society Work');
    const parent=societyWork?.closest('section')||document.getElementById('public');
    parent?.insertAdjacentElement('afterend',publicComplaintSection);
  }
  publicComplaintSection.innerHTML=`<div class="section-head"><div><h2>Complaints</h2><div class="muted">Complaint status visible to all visitors.</div></div></div><div id="publicComplaintsTableWrap" class="table-wrap"><div class="muted" style="padding:18px">Loading complaints...</div></div>`;

  const publicWrap=document.getElementById('publicComplaintsTableWrap');
  if(publicWrap){
    const r=await sb.from('public_complaint_status').select('complaint_number,member_name,category,subject,status,created_at').order('created_at',{ascending:false});
    if(r.error){
      console.error('Public complaints load:',r.error);
      publicWrap.innerHTML='<div class="muted" style="padding:18px">Complaint status is currently unavailable.</div>';
    }else{
      const st=v=>String(v||'submitted').toLowerCase()==='in_progress'?'In Progress':String(v||'submitted').toLowerCase()==='resolved'?'Completed':String(v||'submitted').toLowerCase()==='rejected'?'Rejected':'Submitted';
      const rows=r.data||[];
      publicWrap.innerHTML=rows.length?`<table class="table"><thead><tr><th>Complaint No.</th><th>Member Name</th><th>Category</th><th>Complaint</th><th>Status</th><th>Date</th></tr></thead><tbody>${rows.map(x=>`<tr><td><strong>${complaintEscapedValue(String(x.complaint_number??''))}</strong></td><td>${complaintEscapedValue(x.member_name||'Member')}</td><td>${complaintEscapedValue(x.category||'')}</td><td>${complaintEscapedValue(x.subject||'')}</td><td>${complaintEscapedValue(st(x.status))}</td><td>${x.created_at?new Date(x.created_at).toLocaleDateString('en-IN'):''}</td></tr>`).join('')}</tbody></table>`:'<div class="muted" style="padding:18px">No complaints available.</div>';
    }
  }
}


function applyPublicWhitePanels(){
  // Public/logout page: presentation-only white panels.
  const publicPanelStyle=[
    'background:#fff',
    'border-radius:16px',
    'padding:24px',
    'box-sizing:border-box',
    'box-shadow:0 4px 18px rgba(15,23,42,.06)',
    'border:1px solid #eaecf0'
  ].join(';');
  [
    publicSectionByHeading(['Complaints']),
    publicSectionByHeading(['Events']),
    publicSectionByHeading(['Photo Gallery','Gallery']),
    publicSectionByHeading(['Society Map'])
  ].filter(Boolean).forEach(section=>{
    section.style.cssText=(section.style.cssText||'')+';'+publicPanelStyle;
  });
}

renderPublic().then(()=>applyPublicWhitePanels()).catch(e=>console.error('Initial public render:',e));
const authModal=document.getElementById('authModal');const showLogin=()=>{document.getElementById('authHeading').textContent='Member Login';document.getElementById('authLogin').classList.remove('hidden');document.getElementById('authRegister').classList.add('hidden');authModal.classList.remove('hidden')};const showReg=()=>{document.getElementById('authHeading').textContent='Create Member Account';document.getElementById('authLogin').classList.add('hidden');document.getElementById('authRegister').classList.remove('hidden');authModal.classList.remove('hidden');setTimeout(fixPublicMemberForm,0)};document.getElementById('openLogin').onclick=showLogin;document.getElementById('openRegister').onclick=showReg;document.getElementById('authClose').onclick=()=>authModal.classList.add('hidden');
    setPublicLoginButtonVisible(false);document.getElementById('switchRegister').onclick=showReg;document.getElementById('switchLogin').onclick=showLogin;setTimeout(fixPublicMemberForm,0);

/* ===== PUBLIC TOP NAVIGATION FIX ===== */
function setPublicLoginButtonVisible(visible){
    const btn=document.getElementById('openLogin');
    if(!btn)return;
    btn.style.display=visible ? '' : 'none';
    btn.hidden=!visible;
}

function navigatePublicSection(hash){
    const clean=(hash||'#home').startsWith('#') ? hash : '#'+hash;
    if(window.location.hash!==clean){
        history.pushState(null,'',clean);
    }
    const id=clean.substring(1);
    const target=document.getElementById(id);
    if(target){
        setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),0);
    }
}

function setupPublicTopNavigation(){
    document.querySelectorAll('a[href^="#"]').forEach(link=>{
        const href=(link.getAttribute('href')||'').toLowerCase();
        if(!/^#(home|members|work|events|gallery|map|about)$/.test(href))return;
        if(link.dataset.publicNavBound==='1')return;

        link.dataset.publicNavBound='1';
        link.addEventListener('click',function(e){
            e.preventDefault();
            navigatePublicSection(this.getAttribute('href'));
        });
    });

    window.addEventListener('hashchange',()=>{
        navigatePublicSection(window.location.hash||'#home');
    });

    window.addEventListener('popstate',()=>{
        navigatePublicSection(window.location.hash||'#home');
    });
}

async function login(){
    const loginValue=document.getElementById('loginEmail').value.trim();
    const password=document.getElementById('loginPassword').value;
    if(!loginValue||!password)return toast('Please enter phone/email and password');
    if(!sb)return toast('Supabase is not configured yet');

    const credentials=loginValue.includes('@')
        ? {email:loginValue,password}
        : {phone:loginValue,password};

    const {data,error}=await sb.auth.signInWithPassword(credentials);
    if(error)return toast(error.message);

    const result=await sb.from('profiles').select('*').eq('id',data.user.id).maybeSingle();
    if(result.error)console.error('Profile loading error:',result.error);
    const profile=result.data;
    authModal.classList.add('hidden');

    const user={
        ...data.user,
        name:profile?.full_name||data.user.user_metadata?.full_name||data.user.email?.split('@')[0]||data.user.phone||'Member',
        email:data.user.email||profile?.email||'',
        phone:data.user.phone||profile?.phone||'',
        house_no:profile?.house_number||profile?.house_no||'',
        address:profile?.address||'',
        role:String(profile?.role||'member').trim().toLowerCase()
    };

    if(user.role==='admin') openAdminDashboard(user);
    else openMemberDashboard(user);
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
  <button class="nav-item" data-a="about">ℹ <span>About</span></button>
 </nav><div class="sidebar-bottom"><div class="user-mini"><div class="avatar">${initials(user.name)}</div><div><strong>${user.name}</strong><span>Administrator</span></div></div><button class="outline-btn" id="adminLogout">Log out</button></div></aside>
 <main class="main"><header class="topbar"><div><div class="eyebrow">DEFENSE ENCLAVE SOCIETY</div><h1 id="adminTitle">Admin Dashboard</h1></div><div class="top-actions"><span class="status ongoing">ADMIN</span><div class="avatar">${initials(user.name)}</div></div></header><section id="adminContent" class="content"></section></main>`;
 const nav=app.querySelector('nav'); nav.onclick=e=>{const b=e.target.closest('.nav-item');if(!b)return;adminPage(b.dataset.a,user)};
 document.getElementById('adminLogout').onclick=async()=>{if(sb) await sb.auth.signOut();app.classList.add('hidden');document.getElementById('public').classList.remove('hidden');setPublicLoginButtonVisible(true);toast('Logged out')};
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


function societyAdminModalEsc(v){
    return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function societyAdminModalShell(id,title,subtitle,body,submitText){
    const old=document.getElementById(id);
    if(old)old.remove();

    const overlay=document.createElement('div');
    overlay.id=id;
    overlay.style.cssText='position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;background:rgba(15,23,42,.58);backdrop-filter:blur(3px);';

    overlay.innerHTML=`
    <div role="dialog" aria-modal="true"
         style="width:min(560px,100%);max-height:calc(100vh - 40px);overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.30);padding:24px;box-sizing:border-box;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px;font-size:22px;">${title}</h2>
          <div style="font-size:13px;color:#667085;">${subtitle}</div>
        </div>
        <button type="button" data-modal-close
          style="width:36px;height:36px;border:0;border-radius:50%;background:#f2f4f7;font-size:24px;line-height:1;cursor:pointer;">&times;</button>
      </div>
      ${body}
      <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:4px;border-top:1px solid #eaecf0;">
        <button type="button" data-modal-cancel
          style="margin-top:15px;padding:11px 18px;border:1px solid #d0d5dd;border-radius:9px;background:#fff;cursor:pointer;font-size:14px;">Cancel</button>
        <button type="submit" form="${id}Form"
          style="margin-top:15px;padding:11px 20px;border:0;border-radius:9px;background:#2563eb;color:#fff;cursor:pointer;font-weight:600;font-size:14px;">${submitText}</button>
      </div>
    </div>`;

    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector('[data-modal-close]').onclick=close;
    overlay.querySelector('[data-modal-cancel]').onclick=close;
    overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
    return {overlay,close};
}

function societyAdminFieldError(overlay,field,errorField,message){
    const el=overlay.querySelector('#'+field);
    const er=overlay.querySelector('#'+errorField);
    if(el){
        el.style.borderColor='#d92d20';
        el.style.boxShadow='0 0 0 2px rgba(217,45,32,.10)';
        el.focus();
    }
    if(er){
        er.textContent=message;
        er.style.display='block';
    }
}

function societyAdminClearField(overlay,field,errorField){
    const el=overlay.querySelector('#'+field);
    const er=overlay.querySelector('#'+errorField);
    if(el){el.style.borderColor='#d0d5dd';el.style.boxShadow='none';}
    if(er){er.textContent='';er.style.display='none';}
}

async function adminAddMaintenance(){
    if(!sb)return toast('Supabase is not configured.');

    const body=`
    <form id="maintenanceAddModalForm" novalidate>
      <div id="maintenanceAddGeneralError" style="display:none;margin-bottom:14px;padding:11px 12px;border-radius:9px;background:#fff1f1;color:#b42318;font-size:13px;"></div>

      <div style="margin-bottom:15px;">
        <label for="maintenanceItem" style="display:block;font-weight:600;margin-bottom:6px;">Maintenance item <span style="color:#d92d20;">*</span></label>
        <input id="maintenanceItem" type="text" maxlength="150" placeholder="Enter maintenance item"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">Example: Street Light Repair</div>
        <div id="maintenanceItemError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:15px;">
        <label for="maintenanceAmount" style="display:block;font-weight:600;margin-bottom:6px;">Amount <span style="color:#d92d20;">*</span></label>
        <input id="maintenanceAmount" type="number" min="0" step="0.01" placeholder="Enter amount"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">Enter the maintenance expense amount.</div>
        <div id="maintenanceAmountError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:20px;">
        <label for="maintenanceStatus" style="display:block;font-weight:600;margin-bottom:6px;">Status <span style="color:#d92d20;">*</span></label>
        <select id="maintenanceStatus"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;background:#fff;">
          <option value="">Select status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <div style="font-size:12px;color:#667085;margin-top:5px;">Select the current maintenance status.</div>
        <div id="maintenanceStatusError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>
    </form>`;

    const {overlay,close}=societyAdminModalShell(
        'maintenanceAddModal',
        'Add Maintenance',
        'Enter all maintenance details and save them together.',
        body,
        'Save Maintenance'
    );

    const form=overlay.querySelector('#maintenanceAddModalForm');
    ['maintenanceItem','maintenanceAmount','maintenanceStatus'].forEach((id,idx)=>{
        const errors=['maintenanceItemError','maintenanceAmountError','maintenanceStatusError'];
        overlay.querySelector('#'+id).addEventListener('input',()=>societyAdminClearField(overlay,id,errors[idx]));
        overlay.querySelector('#'+id).addEventListener('change',()=>societyAdminClearField(overlay,id,errors[idx]));
    });

    form.onsubmit=async e=>{
        e.preventDefault();
        ['maintenanceItem','maintenanceAmount','maintenanceStatus'].forEach((id,idx)=>
            societyAdminClearField(overlay,id,['maintenanceItemError','maintenanceAmountError','maintenanceStatusError'][idx]));

        const item=overlay.querySelector('#maintenanceItem').value.trim();
        const amount=Number(overlay.querySelector('#maintenanceAmount').value);
        const status=overlay.querySelector('#maintenanceStatus').value;
        let valid=true;

        if(!item){societyAdminFieldError(overlay,'maintenanceItem','maintenanceItemError','Please enter the maintenance item.');valid=false;}
        if(!Number.isFinite(amount)||amount<0){societyAdminFieldError(overlay,'maintenanceAmount','maintenanceAmountError','Please enter a valid amount.');valid=false;}
        if(!['Active','Pending','Completed'].includes(status)){societyAdminFieldError(overlay,'maintenanceStatus','maintenanceStatusError','Please select a valid status.');valid=false;}
        if(!valid)return;

        const {error}=await sb.from('maintenance').insert({item,amount,status});
        if(error){
            const ge=overlay.querySelector('#maintenanceAddGeneralError');
            ge.textContent='Maintenance save failed: '+error.message;
            ge.style.display='block';
            return;
        }
        close();
        toast('Maintenance added');
        await adminPage('maintenance',window.__adminUser);
    };
}


async function adminEditMaintenance(i){
    const x=window.__maintenanceRows?.[i];
    if(!x)return;
    if(!sb)return toast('Supabase is not configured.');

    const body=`
    <form id="maintenanceEditModalForm" novalidate>
      <div id="maintenanceEditGeneralError" style="display:none;margin-bottom:14px;padding:11px 12px;border-radius:9px;background:#fff1f1;color:#b42318;font-size:13px;"></div>

      <div style="margin-bottom:15px;">
        <label for="editMaintenanceItem" style="display:block;font-weight:600;margin-bottom:6px;">Maintenance item <span style="color:#d92d20;">*</span></label>
        <input id="editMaintenanceItem" type="text" maxlength="150" value="${societyAdminModalEsc(x.item||x.title||x.name||'')}" placeholder="Enter maintenance item"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">Example: Street Light Repair</div>
        <div id="editMaintenanceItemError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:15px;">
        <label for="editMaintenanceAmount" style="display:block;font-weight:600;margin-bottom:6px;">Amount <span style="color:#d92d20;">*</span></label>
        <input id="editMaintenanceAmount" type="number" min="0" step="0.01" value="${Number(x.amount??0)}"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">Enter the maintenance expense amount.</div>
        <div id="editMaintenanceAmountError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:20px;">
        <label for="editMaintenanceStatus" style="display:block;font-weight:600;margin-bottom:6px;">Status <span style="color:#d92d20;">*</span></label>
        <select id="editMaintenanceStatus"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;background:#fff;">
          <option value="">Select status</option>
          <option value="Active" ${x.status==='Active'?'selected':''}>Active</option>
          <option value="Pending" ${x.status==='Pending'?'selected':''}>Pending</option>
          <option value="Completed" ${x.status==='Completed'?'selected':''}>Completed</option>
        </select>
        <div style="font-size:12px;color:#667085;margin-top:5px;">Select the current maintenance status.</div>
        <div id="editMaintenanceStatusError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>
    </form>`;

    const {overlay,close}=societyAdminModalShell(
        'maintenanceEditModal',
        'Edit Maintenance',
        'Update all maintenance details and save them together.',
        body,
        'Update Maintenance'
    );

    const fields=[
        ['editMaintenanceItem','editMaintenanceItemError'],
        ['editMaintenanceAmount','editMaintenanceAmountError'],
        ['editMaintenanceStatus','editMaintenanceStatusError']
    ];
    fields.forEach(([id,err])=>{
        overlay.querySelector('#'+id).addEventListener('input',()=>societyAdminClearField(overlay,id,err));
        overlay.querySelector('#'+id).addEventListener('change',()=>societyAdminClearField(overlay,id,err));
    });

    overlay.querySelector('#maintenanceEditModalForm').onsubmit=async e=>{
        e.preventDefault();
        fields.forEach(([id,err])=>societyAdminClearField(overlay,id,err));

        const item=overlay.querySelector('#editMaintenanceItem').value.trim();
        const amount=Number(overlay.querySelector('#editMaintenanceAmount').value);
        const status=overlay.querySelector('#editMaintenanceStatus').value;
        let valid=true;

        if(!item){societyAdminFieldError(overlay,'editMaintenanceItem','editMaintenanceItemError','Please enter the maintenance item.');valid=false;}
        if(!Number.isFinite(amount)||amount<0){societyAdminFieldError(overlay,'editMaintenanceAmount','editMaintenanceAmountError','Please enter a valid amount.');valid=false;}
        if(!['Active','Pending','Completed'].includes(status)){societyAdminFieldError(overlay,'editMaintenanceStatus','editMaintenanceStatusError','Please select a valid status.');valid=false;}
        if(!valid)return;

        const {error}=await sb.from('maintenance').update({item,amount,status}).eq('id',x.id);
        if(error){
            const ge=overlay.querySelector('#maintenanceEditGeneralError');
            ge.textContent='Maintenance update failed: '+error.message;
            ge.style.display='block';
            return;
        }
        close();
        toast('Maintenance updated');
        await adminPage('maintenance',window.__adminUser);
    };
}


async function adminDeleteMaintenance(i){
    const x=window.__maintenanceRows?.[i]; if(!x)return;
    if(!confirm('Delete this maintenance item?'))return;
    const {error}=await sb.from('maintenance').delete().eq('id',x.id);
    if(error)return toast('Delete failed: '+error.message);
    toast('Maintenance deleted'); await adminPage('maintenance',window.__adminUser);
}


async function getSocietyWorkColumns(){
    const candidates = [
        'name','title','work_name','project_name','work_title',
        'project','work','activity','task','subject',
        'description','details','status','progress',
        'target_date','target','due_date'
    ];

    const columns = {};
    for(const column of candidates){
        try{
            const result = await sb.from('society_work').select(column).limit(1);
            columns[column] = !result.error;
        }catch(_){
            columns[column] = false;
        }
    }
    return columns;
}

function societyWorkTitleColumn(columns){
    return [
        'name','title','work_name','project_name','work_title',
        'project','work','activity','task','subject'
    ].find(column => columns[column] === true) || null;
}

function societyWorkPayload(columns, values){
    const payload = {};
    const titleColumn = societyWorkTitleColumn(columns);

    if(titleColumn) payload[titleColumn] = values.name;

    if(columns.description) payload.description = values.description;
    else if(columns.details) payload.details = values.description;

    if(columns.status) payload.status = values.status;
    if(columns.progress) payload.progress = values.progress;

    if(columns.target_date) payload.target_date = values.target_date;
    else if(columns.target) payload.target = values.target_date;
    else if(columns.due_date) payload.due_date = values.target_date;

    return {payload, titleColumn};
}

async function adminAddWork(){
    if(!sb)return toast('Supabase is not configured.');

    const old=document.getElementById('workAddModal');
    if(old)old.remove();

    const overlay=document.createElement('div');
    overlay.id='workAddModal';
    overlay.style.cssText='position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;background:rgba(15,23,42,.58);backdrop-filter:blur(3px);';

    overlay.innerHTML=`
    <div role="dialog" aria-modal="true" aria-labelledby="workAddTitle"
         style="width:min(560px,100%);max-height:calc(100vh - 40px);overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.30);padding:24px;box-sizing:border-box;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <div>
          <h2 id="workAddTitle" style="margin:0 0 4px;font-size:22px;">Add Society Work</h2>
          <div style="font-size:13px;color:#667085;">Enter all work details and save them together.</div>
        </div>
        <button type="button" id="workModalClose" aria-label="Close"
          style="width:36px;height:36px;border:0;border-radius:50%;background:#f2f4f7;font-size:24px;line-height:1;cursor:pointer;">&times;</button>
      </div>

      <form id="workAddForm" novalidate>
        <div id="workGeneralError" style="display:none;margin-bottom:14px;padding:11px 12px;border-radius:9px;background:#fff1f1;color:#b42318;font-size:13px;"></div>

        <div style="margin-bottom:15px;">
          <label for="workName" style="display:block;font-weight:600;margin-bottom:6px;">Work / project name <span style="color:#d92d20;">*</span></label>
          <input id="workName" type="text" maxlength="150" placeholder="Enter work / project name"
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
          <div style="font-size:12px;color:#667085;margin-top:5px;">Example: Park Renovation</div>
          <div id="workNameError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
        </div>

        <div style="margin-bottom:15px;">
          <label for="workDescription" style="display:block;font-weight:600;margin-bottom:6px;">Description</label>
          <textarea id="workDescription" rows="4" maxlength="2000" placeholder="Enter work details..."
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;resize:vertical;"></textarea>
          <div style="font-size:12px;color:#667085;margin-top:5px;">Optional. Maximum 2000 characters.</div>
        </div>

        <div style="margin-bottom:15px;">
          <label for="workStatus" style="display:block;font-weight:600;margin-bottom:6px;">Status <span style="color:#d92d20;">*</span></label>
          <select id="workStatus"
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;background:#fff;">
            <option value="">Select status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <div style="font-size:12px;color:#667085;margin-top:5px;">Select the current work status.</div>
          <div id="workStatusError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
        </div>

        <div style="margin-bottom:15px;">
          <label for="workProgress" style="display:block;font-weight:600;margin-bottom:6px;">Progress <span style="color:#d92d20;">*</span></label>
          <select id="workProgress"
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;background:#fff;">
            <option value="">Select progress</option>
            <option value="0">0%</option>
            <option value="10">10%</option>
            <option value="20">20%</option>
            <option value="30">30%</option>
            <option value="40">40%</option>
            <option value="50">50%</option>
            <option value="60">60%</option>
            <option value="70">70%</option>
            <option value="80">80%</option>
            <option value="90">90%</option>
            <option value="100">100%</option>
          </select>
          <div style="font-size:12px;color:#667085;margin-top:5px;">Select progress from 0% to 100%.</div>
          <div id="workProgressError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
        </div>

        <div style="margin-bottom:20px;">
          <label for="workTargetDate" style="display:block;font-weight:600;margin-bottom:6px;">Target date</label>
          <input id="workTargetDate" type="text" inputmode="numeric" placeholder="DD/MM/YYYY" autocomplete="off"
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
          <div style="font-size:12px;color:#667085;margin-top:5px;">Format: DD/MM/YYYY &nbsp; Example: 25/09/2026</div>
          <div id="workTargetDateError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:4px;border-top:1px solid #eaecf0;">
          <button type="button" id="workModalCancel"
            style="margin-top:15px;padding:11px 18px;border:1px solid #d0d5dd;border-radius:9px;background:#fff;cursor:pointer;font-size:14px;">Cancel</button>
          <button type="submit" id="workModalSave"
            style="margin-top:15px;padding:11px 20px;border:0;border-radius:9px;background:#2563eb;color:#fff;cursor:pointer;font-weight:600;font-size:14px;">Save Work</button>
        </div>
      </form>
    </div>`;

    document.body.appendChild(overlay);

    const form=overlay.querySelector('#workAddForm');
    const nameEl=overlay.querySelector('#workName');
    const descriptionEl=overlay.querySelector('#workDescription');
    const statusEl=overlay.querySelector('#workStatus');
    const progressEl=overlay.querySelector('#workProgress');
    const targetEl=overlay.querySelector('#workTargetDate');
    const generalEl=overlay.querySelector('#workGeneralError');
    const saveBtn=overlay.querySelector('#workModalSave');

    const close=()=>overlay.remove();

    const setError=(el,errorId,message)=>{
        const errorEl=overlay.querySelector('#'+errorId);
        errorEl.textContent=message||'';
        errorEl.style.display=message?'block':'none';
        el.style.borderColor=message?'#d92d20':'#d0d5dd';
        el.style.backgroundColor=message?'#fff8f7':'#fff';
    };

    const clearErrors=()=>{
        generalEl.style.display='none';
        generalEl.textContent='';
        setError(nameEl,'workNameError','');
        setError(statusEl,'workStatusError','');
        setError(progressEl,'workProgressError','');
        setError(targetEl,'workTargetDateError','');
    };

    const parseDate=(value)=>{
        const m=String(value||'').trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if(!m)return null;
        const day=Number(m[1]),month=Number(m[2]),year=Number(m[3]);
        const d=new Date(Date.UTC(year,month-1,day));
        if(d.getUTCFullYear()!==year||d.getUTCMonth()!==month-1||d.getUTCDate()!==day)return null;
        return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    };

    overlay.querySelector('#workModalClose').onclick=close;
    overlay.querySelector('#workModalCancel').onclick=close;
    overlay.addEventListener('click',e=>{if(e.target===overlay)close();});

    const keyHandler=e=>{
        if(!document.getElementById('workAddModal')){
            document.removeEventListener('keydown',keyHandler);
            return;
        }
        if(e.key==='Escape')close();
    };
    document.addEventListener('keydown',keyHandler);

    form.onsubmit=async e=>{
        e.preventDefault();
        clearErrors();

        const workName=nameEl.value.trim();
        const description=descriptionEl.value.trim();
        const status=statusEl.value;
        const progressValue=progressEl.value;
        const targetInput=targetEl.value.trim();

        let firstInvalid=null;
        const target_date=targetInput?parseDate(targetInput):null;

        if(!workName){
            setError(nameEl,'workNameError','Work / project name is required.');
            firstInvalid=firstInvalid||nameEl;
        }
        if(!status){
            setError(statusEl,'workStatusError','Please select a status.');
            firstInvalid=firstInvalid||statusEl;
        }
        if(!progressValue){
            setError(progressEl,'workProgressError','Please select the progress.');
            firstInvalid=firstInvalid||progressEl;
        }
        if(targetInput && !target_date){
            setError(targetEl,'workTargetDateError','Please enter a valid date in DD/MM/YYYY format.');
            firstInvalid=firstInvalid||targetEl;
        }

        if(firstInvalid){
            generalEl.textContent='Please correct the highlighted field(s).';
            generalEl.style.display='block';
            firstInvalid.focus();
            return;
        }

        saveBtn.disabled=true;
        saveBtn.textContent='Saving...';
        saveBtn.style.opacity='.7';

        try{
            const columns=await getSocietyWorkColumns();
            const built=societyWorkPayload(columns,{
                name:workName,
                description,
                status,
                progress:Number(progressValue),
                target_date
            });

            console.log('Society Work detected columns:',columns);
            console.log('Society Work insert payload:',built.payload);

            if(!built.titleColumn){
                throw new Error('No work-name/title column was found in society_work.');
            }

            const {error}=await sb.from('society_work').insert(built.payload);
            if(error)throw error;

            toast('Work saved successfully');
            close();
            await adminPage('work',window.__adminUser);
        }catch(error){
            console.error('Work save failed:',error);
            saveBtn.disabled=false;
            saveBtn.textContent='Save Work';
            saveBtn.style.opacity='1';
            generalEl.textContent='Work save failed: '+(error?.message||error);
            generalEl.style.display='block';
        }
    };

    setTimeout(()=>nameEl.focus(),50);
}


async function adminDeleteWork(i){
    if(!(await requireAdminDeletePermission()))return;

    const x=window.__workRows?.[i];
    if(!x)return toast('Work not found.');

    const title=x.name||x.title||x.work_name||x.project_name||x.work_title||
        x.project||x.work||x.activity||x.task||x.subject||'this work';

    if(!confirm(`Delete "${title}"?`))return;

    const {error}=await sb.from('society_work').delete().eq('id',x.id);
    if(error)return toast('Work delete failed: '+error.message);

    toast('Work deleted successfully');
    await adminPage('work',window.__adminUser);
}

async function adminEditWork(i){
    const x=window.__workRows?.[i];
    if(!x)return;
    if(!sb)return toast('Supabase is not configured.');

    const old=document.getElementById('workEditModal');
    if(old)old.remove();

    const currentName=x.name||x.title||x.work_name||x.project_name||x.work_title||
        x.project||x.work||x.activity||x.task||x.subject||'';
    const currentDescription=x.description||x.details||'';
    const currentStatus=x.status||'';
    const currentProgress=Number(x.progress??0);
    const currentTarget=x.target_date||x.target||x.due_date||'';

    const toInputDate=(value)=>{
        if(!value)return '';
        const v=String(value).trim();
        if(/^\\d{4}-\\d{2}-\\d{2}$/.test(v))return v;
        const m=v.match(/^(\\d{2})[\\/\\-](\\d{2})[\\/\\-](\\d{4})$/);
        if(m)return `${m[3]}-${m[2]}-${m[1]}`;
        const d=new Date(v);
        if(Number.isNaN(d.getTime()))return '';
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    };

    const esc=(value)=>{
        return String(value??'')
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&#39;');
    };

    const overlay=document.createElement('div');
    overlay.id='workEditModal';
    overlay.style.cssText='position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;background:rgba(15,23,42,.58);backdrop-filter:blur(3px);';

    overlay.innerHTML=`
    <div role="dialog" aria-modal="true" aria-labelledby="workEditTitle"
         style="width:min(560px,100%);max-height:calc(100vh - 40px);overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.30);padding:24px;box-sizing:border-box;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <div>
          <h2 id="workEditTitle" style="margin:0 0 4px;font-size:22px;">Edit Society Work</h2>
          <div style="font-size:13px;color:#667085;">Update all work details and save them together.</div>
        </div>
        <button type="button" id="workEditModalClose" aria-label="Close"
          style="width:36px;height:36px;border:0;border-radius:50%;background:#f2f4f7;font-size:24px;line-height:1;cursor:pointer;">&times;</button>
      </div>

      <form id="workEditForm" novalidate>
        <div id="workEditGeneralError" style="display:none;margin-bottom:14px;padding:11px 12px;border-radius:9px;background:#fff1f1;color:#b42318;font-size:13px;"></div>

        <div style="margin-bottom:15px;">
          <label for="editWorkName" style="display:block;font-weight:600;margin-bottom:6px;">Work / project name <span style="color:#d92d20;">*</span></label>
          <input id="editWorkName" type="text" maxlength="150" value="${esc(currentName)}"
            placeholder="Enter work / project name"
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
          <div style="font-size:12px;color:#667085;margin-top:5px;">Example: Park Renovation</div>
          <div id="editWorkNameError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
        </div>

        <div style="margin-bottom:15px;">
          <label for="editWorkDescription" style="display:block;font-weight:600;margin-bottom:6px;">Description</label>
          <textarea id="editWorkDescription" rows="4" maxlength="2000"
            placeholder="Enter work details..."
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;resize:vertical;">${esc(currentDescription)}</textarea>
          <div style="font-size:12px;color:#667085;margin-top:5px;">Optional. Maximum 2000 characters.</div>
        </div>

        <div style="margin-bottom:15px;">
          <label for="editWorkStatus" style="display:block;font-weight:600;margin-bottom:6px;">Status <span style="color:#d92d20;">*</span></label>
          <select id="editWorkStatus"
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;background:#fff;">
            <option value="">Select status</option>
            <option value="Ongoing" ${currentStatus==='Ongoing'?'selected':''}>Ongoing</option>
            <option value="Pending" ${currentStatus==='Pending'?'selected':''}>Pending</option>
            <option value="Completed" ${currentStatus==='Completed'?'selected':''}>Completed</option>
          </select>
          <div style="font-size:12px;color:#667085;margin-top:5px;">Select the current work status.</div>
          <div id="editWorkStatusError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
        </div>

        <div style="margin-bottom:15px;">
          <label for="editWorkProgress" style="display:block;font-weight:600;margin-bottom:6px;">Progress <span style="color:#d92d20;">*</span></label>
          <select id="editWorkProgress"
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;background:#fff;">
            <option value="">Select progress</option>
            ${[0,10,20,30,40,50,60,70,80,90,100].map(v=>`<option value="${v}" ${currentProgress===v?'selected':''}>${v}%</option>`).join('')}
          </select>
          <div style="font-size:12px;color:#667085;margin-top:5px;">Select progress from 0% to 100%.</div>
          <div id="editWorkProgressError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
        </div>

        <div style="margin-bottom:20px;">
          <label for="editWorkTargetDate" style="display:block;font-weight:600;margin-bottom:6px;">Target date <span style="color:#d92d20;">*</span></label>
          <input id="editWorkTargetDate" type="date" value="${toInputDate(currentTarget)}"
            style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
          <div style="font-size:12px;color:#667085;margin-top:5px;">Select the target completion date.</div>
          <div id="editWorkTargetDateError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button type="button" id="workEditCancel"
            style="padding:10px 16px;border:1px solid #d0d5dd;border-radius:9px;background:#fff;cursor:pointer;">Cancel</button>
          <button type="submit"
            style="padding:10px 18px;border:0;border-radius:9px;background:#1d4ed8;color:#fff;cursor:pointer;font-weight:600;">Update Work</button>
        </div>
      </form>
    </div>`;

    document.body.appendChild(overlay);

    const close=()=>overlay.remove();
    document.getElementById('workEditModalClose').onclick=close;
    document.getElementById('workEditCancel').onclick=close;
    overlay.addEventListener('click',e=>{if(e.target===overlay)close();});

    const fields=[
        ['editWorkName','editWorkNameError'],
        ['editWorkStatus','editWorkStatusError'],
        ['editWorkProgress','editWorkProgressError'],
        ['editWorkTargetDate','editWorkTargetDateError']
    ];

    const clearField=(id,errorId)=>{
        const el=document.getElementById(id);
        const er=document.getElementById(errorId);
        if(el){el.style.borderColor='#d0d5dd';el.style.boxShadow='none';}
        if(er){er.textContent='';er.style.display='none';}
    };

    const showFieldError=(id,errorId,message)=>{
        const el=document.getElementById(id);
        const er=document.getElementById(errorId);
        if(el){
            el.style.borderColor='#d92d20';
            el.style.boxShadow='0 0 0 2px rgba(217,45,32,.10)';
        }
        if(er){
            er.textContent=message;
            er.style.display='block';
        }
    };

    fields.forEach(([id,errorId])=>{
        document.getElementById(id)?.addEventListener('input',()=>clearField(id,errorId));
        document.getElementById(id)?.addEventListener('change',()=>clearField(id,errorId));
    });

    document.getElementById('workEditForm').onsubmit=async(e)=>{
        e.preventDefault();

        const workName=document.getElementById('editWorkName').value.trim();
        const description=document.getElementById('editWorkDescription').value.trim();
        const status=document.getElementById('editWorkStatus').value;
        const progress=Number(document.getElementById('editWorkProgress').value);
        const target_date=document.getElementById('editWorkTargetDate').value;

        fields.forEach(([id,errorId])=>clearField(id,errorId));
        let valid=true;

        if(!workName){
            showFieldError('editWorkName','editWorkNameError','Please enter the work / project name.');
            valid=false;
        }
        if(!['Ongoing','Pending','Completed'].includes(status)){
            showFieldError('editWorkStatus','editWorkStatusError','Please select a valid status.');
            valid=false;
        }
        if(![0,10,20,30,40,50,60,70,80,90,100].includes(progress)){
            showFieldError('editWorkProgress','editWorkProgressError','Please select a progress value.');
            valid=false;
        }
        if(!target_date){
            showFieldError('editWorkTargetDate','editWorkTargetDateError','Please select a target date.');
            valid=false;
        }

        if(!valid)return;

        try{
            const columns=await getSocietyWorkColumns();
            const {payload,titleColumn}=societyWorkPayload(columns,{
                name:workName,
                description,
                status,
                progress,
                target_date
            });

            if(!titleColumn){
                const ge=document.getElementById('workEditGeneralError');
                ge.textContent='No supported work-name column exists in society_work.';
                ge.style.display='block';
                return;
            }

            const {error}=await sb.from('society_work')
                .update(payload)
                .eq('id',x.id);

            if(error){
                console.error('Work update failed:',error,payload);
                const ge=document.getElementById('workEditGeneralError');
                ge.textContent='Work update failed: '+error.message;
                ge.style.display='block';
                return;
            }

            close();
            toast('Work updated successfully');
            await adminPage('work',window.__adminUser);
        }catch(e){
            console.error('Work update exception:',e);
            const ge=document.getElementById('workEditGeneralError');
            ge.textContent='Work update failed: '+(e?.message||e);
            ge.style.display='block';
        }
    };
}



async function adminAddEvent(){
 if(!sb)return toast('Supabase is not configured.');

 const old=document.getElementById('eventFormOverlay');
 if(old)old.remove();

 const overlay=document.createElement('div');
 overlay.id='eventFormOverlay';
 overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';

 overlay.innerHTML=`
  <div style="width:min(620px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.25);padding:24px;box-sizing:border-box;">
   <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
    <h2 style="margin:0;font-size:22px;">Add Event</h2>
    <button type="button" id="eventCancelTop" style="border:0;background:transparent;font-size:26px;cursor:pointer;">&times;</button>
   </div>

   <form id="eventCreateForm" novalidate>
    <div id="eventFormError" style="display:none;margin-bottom:14px;padding:10px 12px;border-radius:8px;background:#fff1f1;color:#b42318;font-size:14px;"></div>

    <label style="display:block;margin-bottom:14px;">
      <span style="display:block;font-weight:600;margin-bottom:6px;">Event date *</span>
      <input id="eventDateInput" type="text" placeholder="DD/MM/YYYY" autocomplete="off"
        style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #cfd4dc;border-radius:8px;font-size:15px;">
      <small style="display:block;margin-top:5px;color:#667085;">Format: DD/MM/YYYY &nbsp; Example: 25/09/2026</small>
      <span class="event-field-error" id="eventDateError"></span>
    </label>

    <label style="display:block;margin-bottom:14px;">
      <span style="display:block;font-weight:600;margin-bottom:6px;">Event title *</span>
      <input id="eventTitleInput" type="text" placeholder="Enter event title" maxlength="150"
        style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #cfd4dc;border-radius:8px;font-size:15px;">
      <small style="display:block;margin-top:5px;color:#667085;">Example: Society Annual Meeting</small>
      <span class="event-field-error" id="eventTitleError"></span>
    </label>

    <label style="display:block;margin-bottom:14px;">
      <span style="display:block;font-weight:600;margin-bottom:6px;">Location / time</span>
      <input id="eventLocationInput" type="text" placeholder="Example: Community Hall, 6:00 PM"
        maxlength="200"
        style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #cfd4dc;border-radius:8px;font-size:15px;">
      <small style="display:block;margin-top:5px;color:#667085;">Example: Society Park, 5:30 PM</small>
      <span class="event-field-error" id="eventLocationError"></span>
    </label>

    <label style="display:block;margin-bottom:20px;">
      <span style="display:block;font-weight:600;margin-bottom:6px;">Description</span>
      <textarea id="eventDescriptionInput" rows="5" maxlength="2000" placeholder="Enter event details..."
        style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #cfd4dc;border-radius:8px;font-size:15px;resize:vertical;"></textarea>
      <small style="display:block;margin-top:5px;color:#667085;">Optional. Maximum 2000 characters.</small>
      <span class="event-field-error" id="eventDescriptionError"></span>
    </label>

    <div style="display:flex;justify-content:flex-end;gap:10px;">
      <button type="button" id="eventCancelBtn" style="padding:11px 18px;border:1px solid #d0d5dd;border-radius:8px;background:#fff;cursor:pointer;">Cancel</button>
      <button type="submit" id="eventSaveBtn" style="padding:11px 20px;border:0;border-radius:8px;background:#2563eb;color:#fff;cursor:pointer;font-weight:600;">Save Event</button>
    </div>
   </form>
  </div>`;

 document.body.appendChild(overlay);

 const form=overlay.querySelector('#eventCreateForm');
 const dateInput=overlay.querySelector('#eventDateInput');
 const titleInput=overlay.querySelector('#eventTitleInput');
 const locationInput=overlay.querySelector('#eventLocationInput');
 const descriptionInput=overlay.querySelector('#eventDescriptionInput');
 const generalError=overlay.querySelector('#eventFormError');
 const saveBtn=overlay.querySelector('#eventSaveBtn');

 const setError=(input,errorEl,message)=>{
   errorEl.textContent=message||'';
   errorEl.style.display=message?'block':'none';
   errorEl.style.cssText += message
     ? ';color:#b42318;font-size:13px;margin-top:5px;'
     : ';';
   input.style.borderColor=message?'#d92d20':'#cfd4dc';
   input.style.backgroundColor=message?'#fff8f7':'#fff';
 };

 const clearErrors=()=>{
   generalError.style.display='none';
   [dateInput,titleInput,locationInput,descriptionInput].forEach((el)=>{
     el.style.borderColor='#cfd4dc';
     el.style.backgroundColor='#fff';
   });
   overlay.querySelectorAll('.event-field-error').forEach(e=>{e.textContent='';e.style.display='none';});
 };

 const parseDate=(value)=>{
   const v=value.trim();
   let m=v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
   if(!m)m=v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
   if(!m)return null;

   const day=v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/) ? Number(m[1]) : Number(m[3]);
   const month=v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/) ? Number(m[2]) : Number(m[2]);
   const year=v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/) ? Number(m[3]) : Number(m[1]);

   const d=new Date(Date.UTC(year,month-1,day));
   if(d.getUTCFullYear()!==year || d.getUTCMonth()!==month-1 || d.getUTCDate()!==day)return null;

   return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
 };

 const close=()=>overlay.remove();
 overlay.querySelector('#eventCancelBtn').onclick=close;
 overlay.querySelector('#eventCancelTop').onclick=close;
 overlay.addEventListener('click',e=>{if(e.target===overlay)close();});

 dateInput.addEventListener('input',()=>{ if(dateInput.value.trim())setError(dateInput,overlay.querySelector('#eventDateError'),''); });
 titleInput.addEventListener('input',()=>{ if(titleInput.value.trim())setError(titleInput,overlay.querySelector('#eventTitleError'),''); });

 form.onsubmit=async(e)=>{
   e.preventDefault();
   clearErrors();

   const eventDate=parseDate(dateInput.value);
   const title=titleInput.value.trim();
   const location=locationInput.value.trim();
   const description=descriptionInput.value.trim();

   let firstInvalid=null;

   if(!eventDate){
     setError(dateInput,overlay.querySelector('#eventDateError'),'Enter a valid date in DD/MM/YYYY format.');
     firstInvalid=firstInvalid||dateInput;
   }

   if(!title){
     setError(titleInput,overlay.querySelector('#eventTitleError'),'Event title is required.');
     firstInvalid=firstInvalid||titleInput;
   } else if(title.length<2){
     setError(titleInput,overlay.querySelector('#eventTitleError'),'Event title must contain at least 2 characters.');
     firstInvalid=firstInvalid||titleInput;
   }

   if(location.length>200){
     setError(locationInput,overlay.querySelector('#eventLocationError'),'Location / time is too long.');
     firstInvalid=firstInvalid||locationInput;
   }

   if(description.length>2000){
     setError(descriptionInput,overlay.querySelector('#eventDescriptionError'),'Description is too long.');
     firstInvalid=firstInvalid||descriptionInput;
   }

   if(firstInvalid){
     firstInvalid.focus();
     generalError.textContent='Please correct the highlighted field(s).';
     generalError.style.display='block';
     return;
   }

   saveBtn.disabled=true;
   saveBtn.textContent='Saving...';

   // Keep the DB payload typed correctly. event_date is YYYY-MM-DD.
   const payload={event_date:eventDate,title,location,description};

   console.log('EVENT SAVE PAYLOAD:',payload);

   const {error}=await sb.from('events').insert(payload);

   if(error){
     console.error('Event save failed:',error);
     saveBtn.disabled=false;
     saveBtn.textContent='Save Event';

     generalError.textContent='Save failed: '+error.message;
     generalError.style.display='block';

     // Highlight date if PostgreSQL reports a date/timestamp problem.
     const msg=(error.message||'').toLowerCase();
     if(msg.includes('date')||msg.includes('timestamp')||msg.includes('time zone')){
       setError(dateInput,overlay.querySelector('#eventDateError'),'The event date could not be saved. Please use DD/MM/YYYY.');
       dateInput.focus();
     }
     return;
   }

   toast('Event saved successfully');
   close();
   await adminPage('events',window.__adminUser);
 };
 titleInput.focus();
}

async function adminEditEvent(i){
 const x=window.__eventRows?.[i]; if(!x)return;

 const old=document.getElementById('eventFormOverlay');
 if(old)old.remove();

 const overlay=document.createElement('div');
 overlay.id='eventFormOverlay';
 overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
 overlay.innerHTML=`
  <div style="width:min(620px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:16px;padding:24px;box-sizing:border-box;">
   <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
    <h2 style="margin:0;">Edit Event</h2><button type="button" id="eventEditClose" style="border:0;background:none;font-size:26px;cursor:pointer;">&times;</button>
   </div>
   <form id="eventEditForm" novalidate>
    <div id="eventEditGeneral" style="display:none;margin-bottom:14px;padding:10px 12px;border-radius:8px;background:#fff1f1;color:#b42318;font-size:14px;"></div>
    <label style="display:block;margin-bottom:14px;"><b>Event date *</b>
      <input id="eeDate" type="text" value="${String(x.event_date||x.date||'').replace(/"/g,'&quot;')}" placeholder="DD/MM/YYYY" style="display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:11px;border:1px solid #cfd4dc;border-radius:8px;">
      <small style="color:#667085;">Format: DD/MM/YYYY</small><span id="eeDateErr" style="display:none;color:#b42318;font-size:13px;margin-top:4px;"></span>
    </label>
    <label style="display:block;margin-bottom:14px;"><b>Event title *</b>
      <input id="eeTitle" type="text" value="${String(x.title||x.name||'').replace(/"/g,'&quot;')}" placeholder="Enter event title" style="display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:11px;border:1px solid #cfd4dc;border-radius:8px;">
      <span id="eeTitleErr" style="display:none;color:#b42318;font-size:13px;margin-top:4px;"></span>
    </label>
    <label style="display:block;margin-bottom:14px;"><b>Location / time</b>
      <input id="eeLocation" type="text" value="${String(x.location||x.place||'').replace(/"/g,'&quot;')}" placeholder="Example: Community Hall, 6:00 PM" style="display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:11px;border:1px solid #cfd4dc;border-radius:8px;">
    </label>
    <label style="display:block;margin-bottom:20px;"><b>Description</b>
      <textarea id="eeDescription" rows="5" placeholder="Enter event details..." style="display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:11px;border:1px solid #cfd4dc;border-radius:8px;resize:vertical;">${String(x.description||'').replace(/</g,'&lt;')}</textarea>
    </label>
    <div style="display:flex;justify-content:flex-end;gap:10px;">
      <button type="button" id="eeCancel" style="padding:11px 18px;border:1px solid #d0d5dd;border-radius:8px;background:#fff;">Cancel</button>
      <button type="submit" id="eeSave" style="padding:11px 20px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-weight:600;">Save Changes</button>
    </div>
   </form>
  </div>`;
 document.body.appendChild(overlay);

 const date=overlay.querySelector('#eeDate'), title=overlay.querySelector('#eeTitle');
 const location=overlay.querySelector('#eeLocation'), description=overlay.querySelector('#eeDescription');
 const parse=(v)=>{
   const m=v.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)||v.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
   if(!m)return null;
   const slash=v.trim().includes('/');
   const day=Number(slash?m[1]:m[3]), month=Number(m[2]), year=Number(slash?m[3]:m[1]);
   const d=new Date(Date.UTC(year,month-1,day));
   return d.getUTCFullYear()===year&&d.getUTCMonth()===month-1&&d.getUTCDate()===day
     ? `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}` : null;
 };
 const close=()=>overlay.remove();
 overlay.querySelector('#eeCancel').onclick=close;
 overlay.querySelector('#eventEditClose').onclick=close;

 overlay.querySelector('#eventEditForm').onsubmit=async e=>{
   e.preventDefault();
   const d=parse(date.value), t=title.value.trim();
   const ge=overlay.querySelector('#eventEditGeneral'), de=overlay.querySelector('#eeDateErr'), te=overlay.querySelector('#eeTitleErr');
   de.textContent='';te.textContent='';de.style.display='none';te.style.display='none';ge.style.display='none';
   date.style.borderColor='#cfd4dc';title.style.borderColor='#cfd4dc';
   let bad=null;
   if(!d){de.textContent='Enter a valid date in DD/MM/YYYY format.';de.style.display='block';date.style.borderColor='#d92d20';bad=date;}
   if(!t){te.textContent='Event title is required.';te.style.display='block';title.style.borderColor='#d92d20';bad=bad||title;}
   if(bad){ge.textContent='Please correct the highlighted field(s).';ge.style.display='block';bad.focus();return;}

   const btn=overlay.querySelector('#eeSave');btn.disabled=true;btn.textContent='Saving...';
   const {error}=await sb.from('events').update({
     event_date:d,title:t,location:location.value.trim(),description:description.value.trim()
   }).eq('id',x.id);
   if(error){
     btn.disabled=false;btn.textContent='Save Changes';
     ge.textContent='Save failed: '+error.message;ge.style.display='block';return;
   }
   toast('Event updated');close();await adminPage('events',window.__adminUser);
 };
}


/* ============================================================
   ADMIN DELETE PERMISSION
   Uses the same authenticated Supabase profile used at login.
   Accepts admin role values such as: admin / Admin / ADMIN /
   administrator / society_admin.
   ============================================================ */
function isAdminRole(role){
    const r=String(role||'').trim().toLowerCase().replace(/[\s-]+/g,'_');
    return r==='admin' || r==='administrator' || r==='society_admin';
}

async function requireAdminDeletePermission(){
    // First use the already restored/login user.
    const currentRole=window.__adminUser?.role;
    if(isAdminRole(currentRole)) return true;

    // If the in-memory role is missing, verify the current auth user
    // against the profiles table.
    try{
        const {data:sessionData,error:sessionError}=await sb.auth.getSession();
        const authUser=sessionData?.session?.user;

        if(sessionError || !authUser){
            console.error('Delete permission: no Supabase session',sessionError);
            toast('Admin session not found. Please sign in again.');
            return false;
        }

        const {data:profile,error:profileError}=await sb
            .from('profiles')
            .select('role')
            .eq('id',authUser.id)
            .maybeSingle();

        if(profileError){
            console.error('Delete permission profile error:',profileError);
            toast('Unable to verify admin role.');
            return false;
        }

        const role=String(profile?.role||'').trim().toLowerCase().replace(/[\s-]+/g,'_');

        window.__adminUser={
            ...(window.__adminUser||{}),
            ...authUser,
            id:authUser.id,
            email:authUser.email||'',
            role
        };

        if(!isAdminRole(role)){
            console.warn('Delete denied. Database profile role:',profile?.role);
            toast('Only an admin can delete this item.');
            return false;
        }

        return true;
    }catch(error){
        console.error('Delete permission exception:',error);
        toast('Unable to verify admin role.');
        return false;
    }
}

async function adminDeleteEvent(i){
    if(!(await requireAdminDeletePermission()))return;

    const x=window.__eventRows?.[i];
    if(!x)return toast('Event not found.');

    if(!confirm(`Delete "${x.title||x.name||'this event'}"?`))return;

    const {error}=await sb.from('events').delete().eq('id',x.id);
    if(error)return toast('Event delete failed: '+error.message);

    toast('Event deleted successfully');
    await adminPage('events',window.__adminUser);
}

async function adminDeleteGalleryPhoto(photoId){
    if(!(await requireAdminDeletePermission()))return;

    const row=(window.__galleryRows||[]).find(x=>String(x.id)===String(photoId));
    if(!row)return toast('Photo not found.');

    if(!confirm(`Delete photo "${row.file_name||'this photo'}"?`))return;

    try{
        if(row.storage_path){
            const {error:storageError}=await sb.storage
                .from('society-gallery')
                .remove([row.storage_path]);
            if(storageError)throw storageError;
        }

        const {error:dbError}=await sb
            .from('gallery_photos')
            .delete()
            .eq('id',photoId);

        if(dbError)throw dbError;

        toast('Photo deleted successfully');
        await adminPage('gallery',window.__adminUser);
    }catch(e){
        console.error('Gallery photo delete failed:',e);
        toast('Photo delete failed: '+(e?.message||e));
    }
}

async function adminDeleteGalleryFolder(folderName){
    if(!(await requireAdminDeletePermission()))return;

    if(!folderName)return;
    if(!confirm(`Delete folder "${folderName}" and ALL photos inside it? This cannot be undone.`))return;

    try{
        const {data:files,error:listError}=await sb.storage
            .from('society-gallery')
            .list(folderName,{limit:1000});

        if(listError)throw listError;

        const paths=(files||[])
            .filter(x=>x?.name)
            .map(x=>`${folderName}/${x.name}`);

        if(paths.length){
            const {error:removeError}=await sb.storage
                .from('society-gallery')
                .remove(paths);
            if(removeError)throw removeError;
        }

        const {data:rows,error:queryError}=await sb
            .from('gallery_photos')
            .select('id,storage_path')
            .like('storage_path',`${folderName}/%`);

        if(queryError)throw queryError;

        const ids=(rows||[]).map(x=>x.id).filter(Boolean);

        if(ids.length){
            const {error:deleteError}=await sb
                .from('gallery_photos')
                .delete()
                .in('id',ids);
            if(deleteError)throw deleteError;
        }

        toast(`Gallery folder "${folderName}" deleted successfully`);
        await adminPage('gallery',window.__adminUser);
    }catch(e){
        console.error('Gallery folder delete failed:',e);
        toast('Folder delete failed: '+(e?.message||e));
    }
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

    const body=`
    <form id="memberAddModalForm" novalidate>
      <div id="memberAddGeneralError" style="display:none;margin-bottom:14px;padding:11px 12px;border-radius:9px;background:#fff1f1;color:#b42318;font-size:13px;"></div>

      <div style="margin-bottom:15px;">
        <label for="memberFullName" style="display:block;font-weight:600;margin-bottom:6px;">Member name <span style="color:#d92d20;">*</span></label>
        <input id="memberFullName" type="text" maxlength="150" placeholder="Enter member full name"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">Example: Raj Sharma</div>
        <div id="memberFullNameError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:15px;">
        <label for="memberHouse" style="display:block;font-weight:600;margin-bottom:6px;">House / Flat number <span style="color:#d92d20;">*</span></label>
        <input id="memberHouse" type="text" maxlength="50" placeholder="Enter house / flat number"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">Example: A-101</div>
        <div id="memberHouseError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:15px;">
        <label for="memberPhone" style="display:block;font-weight:600;margin-bottom:6px;">Phone <span style="color:#d92d20;">*</span></label>
        <input id="memberPhone" type="tel" maxlength="20" placeholder="Enter phone number"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">Required. Example: +919876543210</div>
        <div id="memberPhoneError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:15px;">
        <label for="memberEmail" style="display:block;font-weight:600;margin-bottom:6px;">Email <span style="color:#667085;font-weight:400;">(optional)</span></label>
        <input id="memberEmail" type="email" maxlength="254" placeholder="Enter email address (optional)"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">User can log in with phone or this email.</div>
        <div id="memberEmailError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:15px;">
        <label for="memberPassword" style="display:block;font-weight:600;margin-bottom:6px;">Password <span style="color:#d92d20;">*</span></label>
        <input id="memberPassword" type="password" minlength="6" maxlength="72" placeholder="Enter password"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">Minimum 6 characters.</div>
        <div id="memberPasswordError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:15px;">
        <label for="memberConfirmPassword" style="display:block;font-weight:600;margin-bottom:6px;">Confirm Password <span style="color:#d92d20;">*</span></label>
        <input id="memberConfirmPassword" type="password" minlength="6" maxlength="72" placeholder="Re-enter password"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div id="memberConfirmPasswordError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:20px;">
        <label for="memberAddress" style="display:block;font-weight:600;margin-bottom:6px;">Address <span style="color:#667085;font-weight:400;">(optional)</span></label>
        <textarea id="memberAddress" rows="3" maxlength="500" placeholder="Enter address"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;resize:vertical;"></textarea>
      </div>
    </form>`;

    const {overlay,close}=societyAdminModalShell(
        'memberAddModal',
        'Add Member',
        'Phone is required. Email is optional. The member can log in with either phone or email and the password.',
        body,
        'Save Member'
    );

    overlay.querySelector('#memberAddModalForm').onsubmit=async e=>{
        e.preventDefault();

        [
          ['memberFullName','memberFullNameError'],
          ['memberHouse','memberHouseError'],
          ['memberPhone','memberPhoneError'],
          ['memberEmail','memberEmailError'],
          ['memberPassword','memberPasswordError'],
          ['memberConfirmPassword','memberConfirmPasswordError']
        ].forEach(x=>societyAdminClearField(overlay,x[0],x[1]));

        const full_name=overlay.querySelector('#memberFullName').value.trim();
        const house_number=overlay.querySelector('#memberHouse').value.trim();
        const phone=overlay.querySelector('#memberPhone').value.trim();
        const email=overlay.querySelector('#memberEmail').value.trim();
        const password=overlay.querySelector('#memberPassword').value;
        const confirmPassword=overlay.querySelector('#memberConfirmPassword').value;
        const address=overlay.querySelector('#memberAddress').value.trim();
        let valid=true;

        if(!full_name){
          societyAdminFieldError(overlay,'memberFullName','memberFullNameError','Please enter the member name.');
          valid=false;
        }
        if(!house_number){
          societyAdminFieldError(overlay,'memberHouse','memberHouseError','Please enter the house / flat number.');
          valid=false;
        }
        if(!phone){
          societyAdminFieldError(overlay,'memberPhone','memberPhoneError','Phone number is required.');
          valid=false;
        }
        if(phone && !/^[+0-9][0-9 ()-]{6,19}$/.test(phone)){
          societyAdminFieldError(overlay,'memberPhone','memberPhoneError','Please enter a valid phone number.');
          valid=false;
        }
        if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          societyAdminFieldError(overlay,'memberEmail','memberEmailError','Please enter a valid email address.');
          valid=false;
        }
        if(!password){
          societyAdminFieldError(overlay,'memberPassword','memberPasswordError','Password is required.');
          valid=false;
        }else if(password.length<6){
          societyAdminFieldError(overlay,'memberPassword','memberPasswordError','Password must be at least 6 characters.');
          valid=false;
        }
        if(!confirmPassword){
          societyAdminFieldError(overlay,'memberConfirmPassword','memberConfirmPasswordError','Please confirm the password.');
          valid=false;
        }else if(password!==confirmPassword){
          societyAdminFieldError(overlay,'memberConfirmPassword','memberConfirmPasswordError','Passwords do not match.');
          valid=false;
        }
        if(!valid)return;

        const ge=overlay.querySelector('#memberAddGeneralError');
        ge.style.display='none';

        try{
          /*
           * Creating auth.users requires the Supabase service role and therefore
           * must happen in an Edge Function, never in this browser JS.
           *
           * Deploy an Edge Function named "admin-create-member" that:
           * 1. verifies the caller is an admin,
           * 2. calls auth.admin.createUser(),
           * 3. inserts profiles using the returned auth user id,
           * 4. rolls back the Auth user if profile creation fails.
           */
          // const {data:fnData,error:fnError}=await sb.functions.invoke('admin-create-member',{
          //   body:{
          //     full_name,
          //     house_number,
          //     phone,
          //     email:email||null,
          //     password,
          //     address:address||null,
          //     role:'member'
          //   }
          // });


          // Read the currently authenticated admin session.
          const {data:sessionData,error:sessionError}=await sb.auth.getSession();

          if(sessionError){
            throw new Error('Unable to get admin session: '+sessionError.message);
          }

          const session=sessionData?.session;
          if(!session?.access_token){
            throw new Error('Admin session is not available. Please logout and login again.');
          }

          // Confirm the session belongs to a real authenticated user before
          // calling the protected Edge Function.
          const {data:userData,error:userError}=await sb.auth.getUser(session.access_token);
          if(userError || !userData?.user){
            throw new Error('Unable to verify admin session. Please logout and login again.');
          }

          console.log('Calling admin-create-member:',{
            userId:userData.user.id,
            hasAccessToken:!!session.access_token
          });

          const {data:fnData,error:fnError}=await sb.functions.invoke('admin-create-member',{
            body:{
              full_name,
              house_number,
              phone,
              email:email||null,
              password,
              address:address||null,
              role:'member'
            },
            headers:{
              Authorization:`Bearer ${session.access_token}`
            }
          });

          if(fnError){
            console.error('admin-create-member Edge Function error:',fnError);

            let message=fnError.message||'Member creation failed.';
            try{
              const response=fnError.context;
              if(response && typeof response.clone==='function'){
                const payload=await response.clone().json();
                if(payload?.error)message=payload.error;
              }
            }catch(_){
              // Keep the original error message if the response is not JSON.
            }

            if(fnError.status===401){
              message='Admin authentication was rejected by the Edge Function. Please check the Edge Function authentication/claim handling.';
            }

            throw new Error(message);
          }

          if(!fnData?.success){
            throw new Error(fnData?.error||'Member was not created.');
          }

          close();
          toast('Member saved successfully');

          // Clear the previous member list and reload fresh data from Supabase.
          window.__memberRows = [];
          console.log('Member created successfully. Refreshing Members list...');
          await adminPage('members',window.__adminUser);
        }catch(error){
          console.error('Member save failed:',error);
          ge.textContent='Member save failed: '+(error?.message||error);
          ge.style.display='block';
        }
    };
}

async function adminEditMember(i){
    const x=window.__memberRows?.[i];
    if(!x)return;
    if(!sb)return toast('Supabase is not configured.');

    const esc=societyAdminModalEsc;
    const currentEmail=x.email||x.auth_email||'';

    const passwordField=(id,label,placeholder)=>{
        return `
        <div style="margin-bottom:15px;">
          <label for="${id}" style="display:block;font-weight:600;margin-bottom:6px;">${label}</label>
          <div style="position:relative;">
            <input id="${id}" type="password" autocomplete="new-password"
              placeholder="${placeholder}"
              style="width:100%;box-sizing:border-box;padding:11px 44px 11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
            <button type="button" data-password-toggle="${id}"
              aria-label="Show password"
              style="position:absolute;right:8px;top:50%;transform:translateY(-50%);width:34px;height:34px;border:0;background:transparent;cursor:pointer;font-size:17px;color:#475467;">
              👁
            </button>
          </div>
          <div style="font-size:12px;color:#667085;margin-top:5px;">Leave blank to keep the current password.</div>
          <div id="${id}Error" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
        </div>`;
    };

    const body=`
    <form id="memberEditModalForm" novalidate>
      <div id="memberEditGeneralError" style="display:none;margin-bottom:14px;padding:11px 12px;border-radius:9px;background:#fff1f1;color:#b42318;font-size:13px;"></div>

      <div style="margin-bottom:15px;">
        <label for="editMemberFullName" style="display:block;font-weight:600;margin-bottom:6px;">Member name <span style="color:#d92d20;">*</span></label>
        <input id="editMemberFullName" type="text" maxlength="150" value="${esc(x.full_name||x.name||'')}" placeholder="Enter member full name"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div id="editMemberFullNameError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:15px;">
        <label for="editMemberHouse" style="display:block;font-weight:600;margin-bottom:6px;">House / Flat number <span style="color:#d92d20;">*</span></label>
        <input id="editMemberHouse" type="text" maxlength="50" value="${esc(x.house_number||x.house_no||'')}" placeholder="Enter house / flat number"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div id="editMemberHouseError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      <div style="margin-bottom:15px;">
        <label for="editMemberPhone" style="display:block;font-weight:600;margin-bottom:6px;">Phone</label>
        <input id="editMemberPhone" type="tel" maxlength="20" value="${esc(x.phone||'')}" placeholder="Enter phone number"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
      </div>

      <div style="margin-bottom:15px;">
        <label for="editMemberEmail" style="display:block;font-weight:600;margin-bottom:6px;">Email</label>
        <input id="editMemberEmail" type="email" maxlength="254" value="${esc(currentEmail)}" placeholder="Enter email address" autocomplete="email"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;">
        <div style="font-size:12px;color:#667085;margin-top:5px;">This updates the member's Supabase login email.</div>
        <div id="editMemberEmailError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>

      ${passwordField('editMemberPassword','New Password','Enter new password')}
      ${passwordField('editMemberConfirmPassword','Confirm New Password','Re-enter new password')}

      <div style="margin-bottom:15px;">
        <label for="editMemberAddress" style="display:block;font-weight:600;margin-bottom:6px;">Address</label>
        <textarea id="editMemberAddress" rows="3" maxlength="500" placeholder="Enter address"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;resize:vertical;">${esc(x.address||'')}</textarea>
      </div>

      <div style="margin-bottom:20px;">
        <label for="editMemberRole" style="display:block;font-weight:600;margin-bottom:6px;">Role <span style="color:#d92d20;">*</span></label>
        <select id="editMemberRole"
          style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #d0d5dd;border-radius:9px;font-size:15px;background:#fff;">
          <option value="member" ${String(x.role||'member').toLowerCase()==='member'?'selected':''}>Member</option>
          <option value="admin" ${String(x.role||'').toLowerCase()==='admin'?'selected':''}>Admin</option>
        </select>
        <div id="editMemberRoleError" style="display:none;color:#b42318;font-size:12px;margin-top:5px;"></div>
      </div>
    </form>`;

    const {overlay,close}=societyAdminModalShell(
        'memberEditModal',
        'Edit Member',
        'Update member details, email, or password.',
        body,
        'Update Member'
    );

    overlay.querySelectorAll('[data-password-toggle]').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const input=overlay.querySelector('#'+btn.dataset.passwordToggle);
            if(!input)return;
            const showing=input.type==='text';
            input.type=showing?'password':'text';
            btn.textContent=showing?'👁':'🙈';
            btn.setAttribute('aria-label',showing?'Show password':'Hide password');
        });
    });

    overlay.querySelector('#memberEditModalForm').onsubmit=async e=>{
        e.preventDefault();

        const clear=(id,errorId)=>societyAdminClearField(overlay,id,errorId);
        ['editMemberFullName','editMemberHouse','editMemberEmail','editMemberPassword','editMemberConfirmPassword','editMemberRole']
            .forEach(id=>clear(id,id+'Error'));

        const full_name=overlay.querySelector('#editMemberFullName').value.trim();
        const house_number=overlay.querySelector('#editMemberHouse').value.trim();
        const phone=overlay.querySelector('#editMemberPhone').value.trim();
        const email=overlay.querySelector('#editMemberEmail').value.trim().toLowerCase();
        const password=overlay.querySelector('#editMemberPassword').value;
        const confirmPassword=overlay.querySelector('#editMemberConfirmPassword').value;
        const address=overlay.querySelector('#editMemberAddress').value.trim();
        const role=overlay.querySelector('#editMemberRole').value;

        let valid=true;

        if(!full_name){
            societyAdminFieldError(overlay,'editMemberFullName','editMemberFullNameError','Please enter the member name.');
            valid=false;
        }
        if(!house_number){
            societyAdminFieldError(overlay,'editMemberHouse','editMemberHouseError','Please enter the house / flat number.');
            valid=false;
        }
        if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            societyAdminFieldError(overlay,'editMemberEmail','editMemberEmailError','Please enter a valid email address.');
            valid=false;
        }
        if(password && password.length<6){
            societyAdminFieldError(overlay,'editMemberPassword','editMemberPasswordError','Password must be at least 6 characters.');
            valid=false;
        }
        if(password!==confirmPassword){
            societyAdminFieldError(overlay,'editMemberConfirmPassword','editMemberConfirmPasswordError','Passwords do not match.');
            valid=false;
        }
        if(!['member','admin'].includes(role)){
            societyAdminFieldError(overlay,'editMemberRole','editMemberRoleError','Please select a valid role.');
            valid=false;
        }
        if(!valid)return;

        try{
            const {data:{session},error:sessionError}=await sb.auth.getSession();
            if(sessionError)throw sessionError;
            if(!session?.access_token)throw new Error('Admin session is not available. Please login again.');

            const {data:fnData,error:fnError}=await sb.functions.invoke(
                'admin-create-member',
                {
                    body:{
                        action:'update',
                        user_id:x.id,
                        full_name,
                        house_number,
                        phone:phone||null,
                        email:email||null,
                        password:password||null,
                        address:address||null,
                        role
                    },
                    headers:{
                        Authorization:`Bearer ${session.access_token}`
                    }
                }
            );

            if(fnError){
                console.error('admin-create-member update error:',fnError);
                let message=fnError.message||'Failed to update member.';
                try{
                    const response=fnError.context;
                    if(response && typeof response.clone==='function'){
                        const payload=await response.clone().json();
                        if(payload?.error)message=payload.error;
                    }
                }catch(_){}
                throw new Error(message);
            }

            if(fnData?.error)throw new Error(fnData.error);
            if(!fnData?.success)throw new Error('Member was not updated.');

            close();
            toast('Member updated');
            await adminPage('members',window.__adminUser);
        }catch(error){
            console.error('Member update failed:',error);
            const ge=overlay.querySelector('#memberEditGeneralError');
            ge.textContent='Member update failed: '+(error?.message||error);
            ge.style.display='block';
        }
    };
}

// async function adminDeleteMember(i){
//  const x=window.__memberRows?.[i]; if(!x||!confirm('Remove this member?'))return;
//  const {error}=await sb.from('profiles').delete().eq('id',x.id);
//  if(error)return toast('Member delete failed: '+error.message);
//  toast('Member removed'); await adminPage('members',window.__adminUser);
// }

async function adminDeleteMember(i) {
    const x = window.__memberRows?.[i];

    if (!x) {
        return toast('Member not found.');
    }

    if (!confirm(`Remove "${x.full_name || 'this member'}"?`)) {
        return;
    }

    if (!sb) {
        return toast('Supabase is not configured.');
    }

    try {
        // ---------------------------------------------------------
        // Get current admin session
        // ---------------------------------------------------------
        const {
            data: sessionData,
            error: sessionError
        } = await sb.auth.getSession();

        if (sessionError) {
            throw new Error(
                'Unable to get admin session: ' +
                sessionError.message
            );
        }

        const session = sessionData?.session;

        if (!session?.access_token) {
            throw new Error(
                'Admin session is not available. Please login again.'
            );
        }

        console.log('Deleting member:', {
            memberId: x.id,
            memberName: x.full_name,
            adminId: session.user?.id
        });

        // ---------------------------------------------------------
        // Delete through Edge Function
        //
        // Edge Function will:
        // 1. Verify current user is admin
        // 2. Verify target is a member
        // 3. Delete Auth user
        // 4. Delete profiles record
        // ---------------------------------------------------------
        const {
            data: fnData,
            error: fnError
        } = await sb.functions.invoke(
            'admin-create-member',
            {
                body: {
                    action: 'delete',
                    user_id: x.id
                },
                headers: {
                    Authorization:
                        `Bearer ${session.access_token}`
                }
            }
        );

        if (fnError) {
            console.error(
                'admin-create-member delete error:',
                fnError
            );

            let message =
                fnError.message ||
                'Failed to delete member.';

            // Try to read Edge Function JSON error
            try {
                const response = fnError.context;

                if (
                    response &&
                    typeof response.clone === 'function'
                ) {
                    const payload =
                        await response.clone().json();

                    if (payload?.error) {
                        message = payload.error;
                    }
                }
            } catch (_) {
                // Keep original error message
            }

            throw new Error(message);
        }

        if (fnData?.error) {
            throw new Error(fnData.error);
        }

        if (!fnData?.success) {
            throw new Error(
                'Member was not deleted.'
            );
        }

        console.log(
            'Member deleted successfully:',
            fnData
        );

        // ---------------------------------------------------------
        // Refresh Members page
        // ---------------------------------------------------------
        toast('Member removed');

        await adminPage(
            'members',
            window.__adminUser
        );

    } catch (error) {
        console.error(
            'Member delete failed:',
            error
        );

        toast(
            'Member delete failed: ' +
            (error?.message || error)
        );
    }
}



async function adminUpdateComplaint(i){
  const x=window.__complaintRows?.[i];
  if(!x)return;

  const old=document.getElementById('adminComplaintUpdateModal');
  if(old)old.remove();

  const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const p=window.__complaintProfileMap?.[x.user_id]||{};
  const current=['submitted','in_progress','rejected','resolved'].includes(String(x.status||'').toLowerCase())?String(x.status).toLowerCase():'submitted';

  const overlay=document.createElement('div');
  overlay.id='adminComplaintUpdateModal';
  overlay.style.cssText='position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,23,42,.58);backdrop-filter:blur(3px);overflow:auto;';
  overlay.innerHTML=`<div style="width:min(650px,100%);max-height:calc(100vh - 40px);overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.30);padding:24px;box-sizing:border-box;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
      <div><h2 style="margin:0 0 5px;">Update Complaint</h2><div style="font-size:13px;color:#667085;">Complaint #${esc(x.complaint_number)}</div></div>
      <button type="button" id="adminComplaintClose" style="width:36px;height:36px;border:0;border-radius:50%;background:#f2f4f7;font-size:24px;cursor:pointer;">&times;</button>
    </div>
    <form id="adminComplaintUpdateForm">
      <div class="form-grid">
        <label>Member Name<input value="${esc(p.full_name||p.email||'Member')}" disabled></label>
        <label>Category<input value="${esc(x.category||'')}" disabled></label>
      </div>
      <label>Subject<input value="${esc(x.subject||'')}" disabled></label>
      <label>Description><textarea rows="5" disabled>${esc(x.description||'')}</textarea></label>
      <label>Complaint Status
        <select id="adminComplaintStatus" required>
          <option value="submitted" ${current==='submitted'?'selected':''}>Submitted</option>
          <option value="in_progress" ${current==='in_progress'?'selected':''}>In Progress</option>
          <option value="rejected" ${current==='rejected'?'selected':''}>Rejected</option>
          <option value="resolved" ${current==='resolved'?'selected':''}>Completed</option>
        </select>
      </label>
      <label>Update Remarks<textarea id="adminComplaintRemarks" rows="5" maxlength="3000" placeholder="Enter update remarks...">${esc(x.admin_comment||'')}</textarea></label>
      <div id="adminComplaintUpdateError" style="display:none;margin:12px 0;padding:10px;border-radius:8px;background:#fff1f1;color:#b42318;"></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:15px;border-top:1px solid #eaecf0;">
        <button type="button" id="adminComplaintCancel" class="outline-btn">Cancel</button>
        <button type="submit" id="adminComplaintSave" class="primary-btn">Update Complaint</button>
      </div>
    </form>
  </div>`;

  // Fix accidental malformed label markup if present in template.
  overlay.innerHTML=overlay.innerHTML.replace('<label>Description>','<label>Description');

  document.body.appendChild(overlay);
  const close=()=>overlay.remove();
  overlay.querySelector('#adminComplaintClose').onclick=close;
  overlay.querySelector('#adminComplaintCancel').onclick=close;
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});

  overlay.querySelector('#adminComplaintUpdateForm').onsubmit=async e=>{
    e.preventDefault();
    const errBox=overlay.querySelector('#adminComplaintUpdateError');
    const btn=overlay.querySelector('#adminComplaintSave');
    errBox.style.display='none'; btn.disabled=true; btn.textContent='Updating...';

    try{
      const status=overlay.querySelector('#adminComplaintStatus').value;
      const remarks=overlay.querySelector('#adminComplaintRemarks').value.trim();
      const payload={status,admin_comment:remarks||null,updated_at:new Date().toISOString(),resolved_at:status==='resolved'?new Date().toISOString():null};
      const {error}=await sb.from('complaints').update(payload).eq('id',x.id);
      if(error)throw error;
      close(); toast('Complaint updated successfully.'); await adminPage('complaints',window.__adminUser);
    }catch(error){
      console.error('Complaint update failed:',error);
      errBox.textContent=error?.message||'Unable to update complaint.';
      errBox.style.display='block'; btn.disabled=false; btn.textContent='Update Complaint';
    }
  };
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


/* ===== ABOUT ADMIN MANAGEMENT ===== */
async function adminLoadAbout(){
  if(!sb) throw new Error('Supabase is not configured.');
  const {data,error}=await sb.from('society_about').select('id,description').eq('id',1).maybeSingle();
  if(error) throw error;
  return data || {id:1,description:''};
}
async function adminSaveAbout(){
  const input=document.getElementById('adminAboutDescription');
  const err=document.getElementById('adminAboutError');
  const btn=document.getElementById('adminAboutSave');
  if(!input||!err||!btn)return;
  input.style.borderColor='#d0d5dd'; err.style.display='none';
  const description=input.value.trim();
  if(!description){
    input.style.borderColor='#d92d20';
    err.textContent='Please enter the About page description.';
    err.style.display='block'; input.focus(); return;
  }
  btn.disabled=true; btn.textContent='Saving...';
  try{
    const {data:existing,error:readError}=await sb.from('society_about').select('id').eq('id',1).maybeSingle();
    if(readError)throw readError;
    const result=existing
      ? await sb.from('society_about').update({description,updated_at:new Date().toISOString()}).eq('id',1)
      : await sb.from('society_about').insert({id:1,description,updated_at:new Date().toISOString()});
    if(result.error)throw result.error;
    toast('About page description updated successfully.');
    await adminPage('about',window.__adminUser);
  }catch(e){
    console.error('About save failed:',e);
    err.textContent='About save failed: '+(e?.message||e); err.style.display='block';
  }finally{btn.disabled=false;btn.textContent='Save Description';}
}
async function adminAboutPage(c){
  try{
    const row=await adminLoadAbout();
    const esc=String(row?.description||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    c.innerHTML=`<div class="hero"><div><div class="eyebrow">SOCIETY INFORMATION</div><h2>About Society</h2><div class="muted">Update the description shown on the public About page.</div></div></div>
    <div class="panel">
      <label for="adminAboutDescription" style="display:block;font-weight:600;margin-bottom:8px">About page description <span style="color:#d92d20">*</span></label>
      <textarea id="adminAboutDescription" rows="12" maxlength="5000" placeholder="Enter About page description..." style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #d0d5dd;border-radius:9px;line-height:1.5;resize:vertical">${esc}</textarea>
      <div class="muted" style="font-size:12px;margin-top:6px">Maximum 5000 characters.</div>
      <div id="adminAboutError" style="display:none;margin-top:10px;padding:10px;border-radius:8px;background:#fff1f1;color:#b42318"></div>
      <div style="display:flex;justify-content:flex-end;margin-top:14px"><button id="adminAboutSave" class="primary-btn" onclick="adminSaveAbout()">Save Description</button></div>
    </div>`;
    document.getElementById('adminAboutDescription').addEventListener('input',function(){
      this.style.borderColor='#d0d5dd'; document.getElementById('adminAboutError').style.display='none';
    });
  }catch(e){
    c.innerHTML=`<div class="panel"><h2>About Society</h2><p class="muted">Update the description shown on the public About page.</p>
    <div style="padding:12px;border-radius:8px;background:#fff1f1;color:#b42318">Unable to load About data: ${String(e?.message||e).replace(/</g,'&lt;')}</div>
    <p class="muted">Required Supabase table: <strong>society_about</strong> with <strong>id</strong>, <strong>description</strong>, and <strong>updated_at</strong>.</p></div>`;
  }
}


async function adminPage(p,user){
 const c=document.getElementById('adminContent'),t=document.getElementById('adminTitle');
 document.querySelectorAll('#memberApp .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.a===p));
 const titles={dashboard:'Admin Dashboard',finance:'Society Finance',maintenance:'Active Maintenance',work:'Society Work',events:'Events',gallery:'Photo Gallery',members:'Members',complaints:'Complaints',map:'Society Map',about:'About Society'}; t.textContent=titles[p]||'Admin Dashboard';
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
    ${(rows||[]).map((x,i)=>`<tr><td><strong>${x.name||x.title||x.work_name||x.project_name||x.work_title||x.project||x.work||x.activity||x.task||x.subject||''}</strong></td><td>${x.description||''}</td><td>${x.status||''}</td><td>${Number(x.progress||0)}%</td><td>${x.target_date||x.target||''}</td><td><button class="outline-btn" onclick="adminEditWork(${i})">Edit</button> <button class="outline-btn" onclick="adminDeleteWork(${i})">Delete</button></td></tr>`).join('')}
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
      <button class="outline-btn" onclick='adminDeleteGalleryFolder(${JSON.stringify(folder)})'>Delete Folder</button>
      <div class="gallery-grid" style="margin-top:12px">${photos.map(x=>`<div><img src="${x.public_url||''}" alt="${x.file_name||''}" style="width:100%;height:180px;object-fit:cover;border-radius:10px"><div class="muted">${x.file_name||''}</div>
        <button class="outline-btn" style="margin-top:6px" onclick='adminDeleteGalleryPhoto(${JSON.stringify(x.id)})'>Delete Photo</button>
      </div>`).join('')}</div>
      </div></div>`;
    }).join('')}</div>${folders.length?'':`<div class="panel"><div class="muted">No gallery folders or photos saved yet.</div></div>`}`;
}else if(p==='members'){
   // const {data:rows,error}=await sb.from('profiles').select('*').order('created_at',{ascending:false});
     const { data: rows, error } = await sb
      .from('profiles')
      .select('*')
      .eq('role', 'member')
      .order('created_at', { ascending: false });
    if(error){ console.error('Members load error:',error); return toast('Unable to load Members: '+error.message); }
    window.__memberRows=rows||[];
    console.log('Members list refreshed. Member count:', window.__memberRows.length);
    c.innerHTML=`<div class="hero"><div><h2>Members</h2><div class="muted">Showing only member profiles saved in the database.</div></div><button class="primary-btn" onclick="adminAddMember()">+ Add Member</button></div>
    <div class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>Member</th><th>House</th><th>Phone</th><th>Role</th><th>Action</th></tr></thead><tbody>
    ${(rows||[]).map((x,i)=>`<tr><td><strong>${x.full_name||x.name||x.email||''}</strong><br><span class="muted">${x.email||''}</span></td><td>${x.house_number||x.house_no||''}</td><td>${x.phone||''}</td><td>${x.role||'member'}</td><td><button class="outline-btn" onclick="adminEditMember(${i})">Edit</button> <button class="outline-btn" onclick="adminDeleteMember(${i})">Delete</button></td></tr>`).join('')}
    </tbody></table></div>${rows?.length?'':`<div class="muted" style="padding:18px">No member profiles saved yet.</div>`}</div>`;
}else if(p==='complaints'){
  const {data:rows,error}=await sb.from('complaints').select('*').order('created_at',{ascending:false});
  if(error)return toast('Unable to load Complaints: '+error.message);

  const complaintRows=rows||[];
  const ids=[...new Set(complaintRows.map(x=>x.user_id).filter(Boolean))];
  let profiles={};
  if(ids.length){
    const r=await sb.from('profiles').select('id,full_name,email,house_number').in('id',ids);
    if(r.error)console.error('Complaint profile load:',r.error);
    (r.data||[]).forEach(p=>profiles[p.id]=p);
  }

  window.__complaintRows=complaintRows;
  window.__complaintProfileMap=profiles;

  const statusText=s=>{
    s=String(s||'submitted').toLowerCase();
    return s==='in_progress'?'In Progress':s==='resolved'?'Completed':s==='rejected'?'Rejected':'Submitted';
  };

  c.innerHTML=`<div class="hero"><div><div class="eyebrow">ADMINISTRATION</div><h2>Complaints</h2><div class="muted">Manage member complaints and update status and remarks.</div></div></div>
  <div class="panel"><div class="table-wrap"><table class="table">
  <thead><tr><th>Complaint No.</th><th>Member Name</th><th>Category</th><th>Subject</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
  <tbody>${complaintRows.map((x,i)=>{const p=profiles[x.user_id]||{};return `<tr>
    <td><strong>${x.complaint_number??''}</strong></td>
    <td>${p.full_name||p.email||'Member'}</td>
    <td>${x.category||''}</td>
    <td>${x.subject||''}</td>
    <td><span class="status ${String(x.status||'submitted').toLowerCase()}">${statusText(x.status)}</span></td>
    <td>${x.created_at?new Date(x.created_at).toLocaleDateString('en-IN'):''}</td>
    <td><button class="outline-btn" onclick="adminUpdateComplaint(${i})">Update</button></td>
  </tr>`}).join('')}</tbody></table></div>
  ${complaintRows.length?'':'<div class="muted" style="padding:18px">No complaints saved yet.</div>'}</div>`;
}else if(p==='map'){
    c.innerHTML=`<div class="hero"><div><h2>Society Map</h2><div class="muted">Defense Enclave Society location</div></div></div>
    <div class="panel">
      <div style="border-radius:14px;overflow:hidden;border:1px solid rgba(0,0,0,.12)">
        <iframe
          title="Defense Enclave Society Map"
          src="https://www.google.com/maps?q=30.777604,76.616637&z=17&output=embed"
          width="100%" height="520" style="border:0;display:block"
          loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;flex-wrap:wrap">
        <div class="muted">30.777604, 76.616637</div>
        <a class="outline-btn" href="https://maps.app.goo.gl/A9TuNFyh9xzpTynU8" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
      </div>
    </div>`;
}else if(p==='about'){
  await adminAboutPage(c);
}
}
function openMemberDashboard(user){document.getElementById('public').classList.add('hidden');const app=document.getElementById('memberApp');app.className='app-shell';app.innerHTML=`<aside class="sidebar"><div class="brand"><div class="brand-mark">DE</div><div><strong>Defense Enclave</strong><span>Member Portal</span></div></div><nav><button class="nav-item active" data-p="dash">⌂ <span>Dashboard</span></button>
<button class="nav-item" data-p="finance">₹ <span>Society Finance</span></button><button class="nav-item" data-p="profile">♙ <span>My Profile</span></button><button class="nav-item" data-p="complaints">⚑ <span>Complaints</span></button><button class="nav-item" data-p="work">▣ <span>Society Work</span></button><button class="nav-item" data-p="events">◷ <span>Events</span></button><button class="nav-item" data-p="gallery">▧ <span>Gallery</span></button></nav><div class="sidebar-bottom"><div class="user-mini"><div class="avatar">${(user.name||'A J').split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><strong>${user.name||'Member'}</strong><span>${user.house_no||'Member'}</span></div></div><button class="outline-btn" id="memberLogout">Log out</button></div></aside><main class="main"><header class="topbar"><div><div class="eyebrow">DEFENSE ENCLAVE SOCIETY</div><h1 id="memberTitle">Member Dashboard</h1></div><div class="top-actions"><button class="icon-btn" id="memberTour">?</button><div class="avatar">${(user.name||'A J').split(' ').map(x=>x[0]).slice(0,2).join('')}</div></div></header><section id="memberContent" class="content"></section></main>`;const nav=app.querySelector('nav');nav.onclick=e=>{const b=e.target.closest('.nav-item');if(!b)return;memberPage(b.dataset.p,user)};document.getElementById('memberLogout').onclick=async()=>{if(sb){const {error}=await sb.auth.signOut();if(error)return toast(error.message)}app.classList.add('hidden');document.getElementById('public').classList.remove('hidden');setPublicLoginButtonVisible(true);toast('Logged out')};document.getElementById('memberTour').onclick=()=>toast('Tour: dashboard → profile → complaints → work → events → gallery');memberPage('dash',user)}
async function memberPage(p,user){
  const c=document.getElementById('memberContent'),t=document.getElementById('memberTitle');
  document.querySelectorAll('#memberApp .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.p===p));
  t.textContent={dash:'Member Dashboard',finance:'Society Finance',profile:'My Profile',complaints:'Complaints',work:'Society Work',events:'Events',gallery:'Photo Gallery'}[p]||'Member Dashboard';
  if(!sb)return;
  try{
    if(p==='profile'){
      const {data:profile,error:profileError}=await sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
      if(profileError) throw profileError;
      const u=profile||user;
      const esc=(v)=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
      c.innerHTML=`
        <div class="hero">
          <div>
            <h2>My Profile</h2>
            <div class="muted">Your registered society information.</div>
          </div>
          <button class="primary-btn" id="editMemberProfile">Edit</button>
        </div>
        <div class="panel">
          <div class="form-grid">
            <label>Name<input value="${esc(u.full_name||u.name||'')}" readonly></label>
            <label>Email<input value="${esc(u.email||user.email||'')}" readonly></label>
            <label>House / Flat<input value="${esc(u.house_number||u.house_no||'')}" readonly></label>
            <label>Phone<input value="${esc(u.phone||user.phone||'')}" readonly></label>
          </div>
          <label>Address<textarea readonly>${esc(u.address||'')}</textarea></label>
        </div>`;

      document.getElementById('editMemberProfile').onclick=()=>{
        const old=document.getElementById('memberProfileEditModal');
        if(old) old.remove();
        const overlay=document.createElement('div');
        overlay.id='memberProfileEditModal';
        overlay.style.cssText='position:fixed;inset:0;background:rgba(15,23,42,.58);display:flex;align-items:center;justify-content:center;padding:20px;z-index:10000;overflow:auto;';
        overlay.innerHTML=`
          <div role="dialog" aria-modal="true" style="width:min(720px,100%);max-height:calc(100vh - 40px);overflow-y:auto;background:#fff;border-radius:18px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,.25);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px;">
              <div><h2 style="margin:0 0 4px;font-size:24px;">Edit Profile</h2><div style="color:#64748b;font-size:13px;">Update your registered society information.</div></div>
              <button type="button" id="memberProfileEditClose" style="border:0;background:transparent;font-size:26px;cursor:pointer;line-height:1;">&times;</button>
            </div>
            <form id="memberProfileEditForm" novalidate>
              <div id="memberProfileEditError" style="display:none;margin-bottom:14px;padding:11px 12px;border-radius:9px;background:#fff1f1;color:#b42318;font-size:13px;"></div>
              <div class="form-grid">
                <label>Name<input id="profileEditName" value="${esc(u.full_name||u.name||'')}" required></label>
                <label>Phone<input id="profileEditPhone" value="${esc(u.phone||user.phone||'')}" required></label>
                <label>Email<input id="profileEditEmail" value="${esc(u.email||user.email||'')}" readonly disabled></label>
                <label>House / Flat<input id="profileEditHouse" value="${esc(u.house_number||u.house_no||'')}" required></label>
              </div>
              <div style="margin-top:14px;">
                <label>Password <span style="color:#64748b;font-size:12px;">(leave blank to keep current password)</span></label>
                <div style="position:relative;">
                  <input id="profileEditPassword" type="password" autocomplete="new-password" minlength="6" style="width:100%;padding-right:70px;">
                  <button type="button" id="profileEditPasswordToggle" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:#475569;font-weight:600;cursor:pointer;">Show</button>
                </div>
              </div>
              <div style="margin-top:14px;">
                <label>Confirm Password</label>
                <div style="position:relative;">
                  <input id="profileEditConfirmPassword" type="password" autocomplete="new-password" minlength="6" style="width:100%;padding-right:70px;">
                  <button type="button" id="profileEditConfirmToggle" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:#475569;font-weight:600;cursor:pointer;">Show</button>
                </div>
              </div>
              <div style="margin-top:14px;">
                <label>Address<textarea id="profileEditAddress" rows="4">${esc(u.address||'')}</textarea></label>
              </div>
              <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
                <button type="button" id="memberProfileEditCancel" class="outline-btn">Cancel</button>
                <button type="submit" id="memberProfileEditSave" class="primary-btn">Save Changes</button>
              </div>
            </form>
          </div>`;
        document.body.appendChild(overlay);
        const close=()=>overlay.remove();
        document.getElementById('memberProfileEditClose').onclick=close;
        document.getElementById('memberProfileEditCancel').onclick=close;
        overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
        const toggle=(inputId,buttonId)=>{
          const input=document.getElementById(inputId),button=document.getElementById(buttonId);
          button.onclick=()=>{const show=input.type==='password';input.type=show?'text':'password';button.textContent=show?'Hide':'Show';};
        };
        toggle('profileEditPassword','profileEditPasswordToggle');
        toggle('profileEditConfirmPassword','profileEditConfirmToggle');
        document.getElementById('memberProfileEditForm').onsubmit=async e=>{
          e.preventDefault();
          const ge=document.getElementById('memberProfileEditError');
          ge.style.display='none';
          const name=document.getElementById('profileEditName').value.trim();
          const phone=document.getElementById('profileEditPhone').value.trim();
          const house=document.getElementById('profileEditHouse').value.trim();
          const address=document.getElementById('profileEditAddress').value.trim();
          const password=document.getElementById('profileEditPassword').value;
          const confirmPassword=document.getElementById('profileEditConfirmPassword').value;
          if(!name||!house||!phone){ge.textContent='Name, House / Flat and Phone are required.';ge.style.display='block';return;}
          if(phone && !/^[+0-9][0-9 ()-]{6,19}$/.test(phone)){ge.textContent='Please enter a valid phone number.';ge.style.display='block';return;}
          if(password && password.length<6){ge.textContent='Password must be at least 6 characters.';ge.style.display='block';return;}
          if(password!==confirmPassword){ge.textContent='Passwords do not match.';ge.style.display='block';return;}
          const saveBtn=document.getElementById('memberProfileEditSave');
          saveBtn.disabled=true; saveBtn.textContent='Saving...';
          try{
            const profileUpdate={full_name:name,phone,house_number:house,address:address||null,updated_at:new Date().toISOString()};
            const {error:profileUpdateError}=await sb.from('profiles').update(profileUpdate).eq('id',user.id);
            if(profileUpdateError) throw profileUpdateError;
            if(password){
              const {error:passwordError}=await sb.auth.updateUser({password});
              if(passwordError) throw passwordError;
            }
            Object.assign(user,{name,phone,house_no:house,address});
            close();
            await memberPage('profile',user);
            toast('Profile updated successfully');
          }catch(err){
            console.error('Member profile update failed:',err);
            ge.textContent=err?.message||'Unable to update profile.';
            ge.style.display='block';
          }finally{
            saveBtn.disabled=false; saveBtn.textContent='Save Changes';
          }
        };
      };
    }else if(p==='finance'){
      const {data:f,error}=await sb.from('society_finance')
        .select('society_fund,total_expenses,active_maintenance,pending_tasks,updated_at')
        .eq('id',1)
        .maybeSingle();

      if(error){
        console.error('Member finance load error:',error);
        c.innerHTML=`<div class="panel"><h3>Society Finance</h3><div class="muted">Unable to load finance information.</div></div>`;
        return;
      }

      const v=f||{
        society_fund:0,
        total_expenses:0,
        active_maintenance:0,
        pending_tasks:0
      };

      c.innerHTML=`<div class="hero">
        <div>
          <div class="eyebrow">MEMBER VIEW</div>
          <h2>Society Finance</h2>
          <div class="muted">Current society finance information. This page is read-only for members.</div>
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-head">Society Fund<span>●</span></div>
          <div class="value">₹${Number(v.society_fund||0).toLocaleString('en-IN')}</div>
          <div class="trend">Current database value</div>
        </div>
        <div class="stat">
          <div class="stat-head">Total Expenses<span>●</span></div>
          <div class="value">₹${Number(v.total_expenses||0).toLocaleString('en-IN')}</div>
          <div class="trend">Current database value</div>
        </div>
        <div class="stat">
          <div class="stat-head">Active Maintenance<span>●</span></div>
          <div class="value">₹${Number(v.active_maintenance||0).toLocaleString('en-IN')}</div>
          <div class="trend">Current database value</div>
        </div>
        <div class="stat">
          <div class="stat-head">Pending Tasks<span>●</span></div>
          <div class="value">${Number(v.pending_tasks||0)}</div>
          <div class="trend">Current database value</div>
        </div>
      </div>

      <div class="panel">
        <h3>Society Finance Details</h3>
        <div class="form-grid">
          <label>Society Fund
            <input type="text" value="₹${Number(v.society_fund||0).toLocaleString('en-IN')}" readonly>
          </label>
          <label>Total Expenses
            <input type="text" value="₹${Number(v.total_expenses||0).toLocaleString('en-IN')}" readonly>
          </label>
          <label>Active Maintenance
            <input type="text" value="₹${Number(v.active_maintenance||0).toLocaleString('en-IN')}" readonly>
          </label>
          <label>Pending Tasks
            <input type="text" value="${Number(v.pending_tasks||0)}" readonly>
          </label>
        </div>
        ${v.updated_at?`<div class="muted" style="margin-top:14px">Last updated: ${new Date(v.updated_at).toLocaleString('en-IN')}</div>`:''}
      </div>`;
    }else if(p==='dash'){
      const [{data:finance},{data:work},{data:complaints}]=await Promise.all([
        sb.from('society_finance').select('*').eq('id',1).maybeSingle(),
        sb.from('society_work').select('*').order('created_at',{ascending:false}).limit(6),
        sb.from('complaints').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(5)
      ]);
      const f=finance||{};
      const active=(work||[]).filter(x=>String(x.status||'').toLowerCase()!=='completed').length;
      c.innerHTML=`<div class="hero"><div><div class="eyebrow">WELCOME BACK</div><h2>Good afternoon, ${user.name||'Member'}!</h2><div class="muted">Current society information from the database.</div></div><button class="primary-btn" id="newComplaint">+ New Complaint</button></div><div class="stats">${[['Society Fund',`₹${Number(f.society_fund||0).toLocaleString('en-IN')}`,'Current balance'],['Total Expenses',`₹${Number(f.total_expenses||0).toLocaleString('en-IN')}`,'This year'],['Active Maintenance',String(active),'Active work items'],['My Complaints',String((complaints||[]).length),'Recent complaints']].map(x=>`<div class="stat"><div class="stat-head">${x[0]}<span>●</span></div><div class="value">${x[1]}</div><div class="trend">${x[2]}</div></div>`).join('')}</div><div class="grid-2-equal"><div class="panel"><h3>Recent Society Work</h3>${(work||[]).slice(0,5).map(w=>`<div class="activity-item"><div class="activity-icon">✓</div><div><strong>${w.name||w.title||w.work_name||w.project_name||w.work_title||w.project||w.work||w.activity||w.task||w.subject||'Work'}</strong><p>${w.status||''} · ${Number(w.progress||0)}%</p></div></div>`).join('')||'<div class="muted">No work records.</div>'}</div><div class="panel"><h3>My Recent Complaints</h3>${(complaints||[]).map(x=>`<div class="activity-item"><div class="activity-icon">⚑</div><div><strong>${x.subject||x.title||x.description||x.message||'Complaint'}</strong><p>${x.status||'Submitted'} · ${x.created_at?new Date(x.created_at).toLocaleDateString('en-IN'):''}</p></div></div>`).join('')||'<div class="muted">No complaints submitted.</div>'}</div></div>`;
    }else if(p==='complaints'){
      const {data:rows,error}=await sb.from('complaints').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
      if(error)throw error;
      c.innerHTML=`<div class="hero"><div><h2>My Complaints</h2><div class="muted">Submit and track your complaints.</div></div><button class="primary-btn" id="newComplaint">+ New Complaint</button></div><div class="panel"><table class="table"><thead><tr><th>ID</th><th>Category</th><th>Complaint</th><th>Status</th><th>Date</th></tr></thead><tbody>${(rows||[]).map(x=>`<tr><td>${x.complaint_no||x.ticket_no||x.id||''}</td><td>${x.category||''}</td><td>${x.subject||x.title||x.description||x.message||''}</td><td>${x.status||'Submitted'}</td><td>${x.created_at?new Date(x.created_at).toLocaleDateString('en-IN'):''}</td></tr>`).join('')}</tbody></table>${rows?.length?'':'<div class="muted" style="padding:18px">No complaints saved yet.</div>'}</div>`;
    }else if(p==='work'){
      const {data:rows,error}=await sb.from('society_work').select('*').order('created_at',{ascending:false}); if(error)throw error;
      c.innerHTML=`<div class="hero"><div><h2>Society Work</h2><div class="muted">Current projects from the database.</div></div></div><div class="panel"><table class="table"><thead><tr><th>Project</th><th>Status</th><th>Progress</th><th>Target</th></tr></thead><tbody>${(rows||[]).map(w=>`<tr><td><strong>${w.name||w.title||w.work_name||w.project_name||w.work_title||w.project||w.work||w.activity||w.task||w.subject||''}</strong><br><span class="muted">${w.description||w.details||''}</span></td><td>${w.status||''}</td><td><div class="progress"><i style="width:${Number(w.progress||0)}%"></i></div>${Number(w.progress||0)}%</td><td>${w.target_date||w.target||w.due_date||''}</td></tr>`).join('')}</tbody></table></div>`;
    }else if(p==='events'){
      const {data:rows,error}=await sb.from('events').select('*').order('event_date',{ascending:false}); if(error)throw error;
      c.innerHTML=`<div class="hero"><div><h2>Events</h2><div class="muted">Upcoming society events from the database.</div></div></div><div class="event-grid">${(rows||[]).map(e=>`<div class="card"><div class="photo">📅</div><div class="card-body"><div class="event-date">${e.event_date||e.date||''}</div><h3>${e.title||e.name||''}</h3><div class="muted">${e.location||e.place||e.description||''}</div></div></div>`).join('')}</div>`;
    }else if(p==='gallery'){
      const {data:rows,error}=await sb.from('gallery_photos').select('*').order('created_at',{ascending:false}); if(error)throw error;
      c.innerHTML=`<div class="hero"><div><h2>Photo Gallery</h2><div class="muted">Community photos from the database.</div></div></div><div class="gallery-grid">${(rows||[]).map((g,i)=>`<div class="card"><div class="photo">${g.public_url?`<img src="${g.public_url}" alt="${g.file_name||'Gallery photo'}" style="width:100%;height:100%;object-fit:cover">`:['◉','★','♧','✦','✓','◎'][i%6]}</div><div class="card-body"><strong>${g.file_name||'Gallery Photo'}</strong></div></div>`).join('')}</div>`;
    }
    document.getElementById('newComplaint')?.addEventListener('click',()=>{
      const existing=document.getElementById('memberComplaintModal');
      if(existing) existing.remove();

      const modal=document.createElement('div');
      modal.id='memberComplaintModal';
      modal.style.cssText='position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.58);overflow:auto;';

      const phone=user.phone||'';
      const email=user.email||'';

      modal.innerHTML=`<div style="width:min(650px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:16px;padding:22px;box-sizing:border-box;box-shadow:0 24px 70px rgba(0,0,0,.25)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px">
          <div><h2 style="margin:0 0 4px">New Complaint</h2><div class="muted">Submit your complaint to the society administration.</div></div>
          <button type="button" id="memberComplaintClose" class="outline-btn" style="padding:8px 12px">✕</button>
        </div>

        <form id="memberComplaintForm">
          <div class="form-grid">
            <label>Category
              <select id="complaintCategory" required>
                <option value="">Select Category</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Security">Security</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Parking">Parking</option>
                <option value="Street Light">Street Light</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>Contact Phone
              <input id="complaintPhone" type="tel" value="${complaintEscapedValue(phone)}" placeholder="Phone number">
            </label>
          </div>

          <label>Subject
            <input id="complaintSubject" type="text" maxlength="200" required placeholder="Enter complaint subject">
          </label>

          <label>Description
            <textarea id="complaintDescription" rows="6" maxlength="5000" required placeholder="Describe your complaint"></textarea>
          </label>

          <label>Contact Email
            <input id="complaintEmail" type="email" value="${complaintEscapedValue(email)}" placeholder="Email address">
          </label>

          <div id="memberComplaintError" style="display:none;margin:12px 0;padding:10px;border-radius:8px;background:#fff1f1;color:#b42318"></div>

          <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:14px;margin-top:8px;border-top:1px solid #eaecf0">
            <button type="button" id="memberComplaintCancel" class="outline-btn">Cancel</button>
            <button type="submit" id="memberComplaintSubmit" class="primary-btn">Submit Complaint</button>
          </div>
        </form>
      </div>`;

      document.body.appendChild(modal);

      const close=()=>modal.remove();
      modal.querySelector('#memberComplaintClose').onclick=close;
      modal.querySelector('#memberComplaintCancel').onclick=close;
      modal.addEventListener('click',e=>{if(e.target===modal)close();});

      modal.querySelector('#memberComplaintForm').onsubmit=async e=>{
        e.preventDefault();

        const errorBox=modal.querySelector('#memberComplaintError');
        const submitBtn=modal.querySelector('#memberComplaintSubmit');
        errorBox.style.display='none';
        submitBtn.disabled=true;
        submitBtn.textContent='Submitting...';

        try{
          if(!sb) throw new Error('Database connection is not available.');

          const sessionResult=await sb.auth.getSession();
          const authUser=sessionResult?.data?.session?.user;

          if(!authUser || authUser.id!==user.id){
            throw new Error('Your login session has expired. Please log in again.');
          }

          const payload={
            user_id:authUser.id,
            category:modal.querySelector('#complaintCategory').value.trim(),
            subject:modal.querySelector('#complaintSubject').value.trim(),
            description:modal.querySelector('#complaintDescription').value.trim(),
            contact_phone:modal.querySelector('#complaintPhone').value.trim()||null,
            contact_email:modal.querySelector('#complaintEmail').value.trim()||null,
            status:'submitted'
          };

          if(!payload.category) throw new Error('Please select a complaint category.');
          if(!payload.subject) throw new Error('Please enter a complaint subject.');
          if(!payload.description) throw new Error('Please enter the complaint description.');

          const {error}=await sb.from('complaints').insert(payload);
          if(error) throw error;

          close();
          toast('Complaint submitted successfully.');
          await memberPage('complaints',user);
        }catch(error){
          console.error('Complaint submission failed:',error);
          errorBox.textContent=error?.message||'Unable to submit complaint.';
          errorBox.style.display='block';
          submitBtn.disabled=false;
          submitBtn.textContent='Submit Complaint';
        }
      };
    });
  }catch(e){console.error('Member page load failed:',e);c.innerHTML=`<div class="panel"><div class="muted">Unable to load this page: ${e?.message||e}</div></div>`;}
}


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
        setPublicLoginButtonVisible(false);

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
            document.getElementById('public')?.classList.remove('hidden');setPublicLoginButtonVisible(true);
            renderPublic().catch(e=>console.error('Public refresh:',e));
        }
    });
}


document.addEventListener('DOMContentLoaded',()=>{
    setupPublicTopNavigation();
    setPublicLoginButtonVisible(true);
});


/* ===== REMOVE ABOUT FROM PUBLIC TOP BAR ONLY ===== */
function removePublicAboutFromTopBar(){
    document.querySelectorAll('a').forEach(link=>{
        if(link.closest('#memberApp'))return;
        const text=(link.textContent||'').trim().toLowerCase();
        const href=(link.getAttribute('href')||'').trim().toLowerCase();
        if(text==='about' || href==='#about'){
            link.remove();
        }
    });
}
if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',removePublicAboutFromTopBar);
}else{
    removePublicAboutFromTopBar();
}


/* ===== REMOVE PUBLIC TOP LINKS / LOGIN VISIBILITY ===== */
(function(){
  const PUBLIC_LINKS = new Set(['#home','#members','#work','#events','#gallery','#map']);
  function isAdminSideMenu(el){
    return !!el.closest('#adminApp .sidebar,#adminApp .side-menu,#adminSideMenu,#memberApp nav');
  }
  function cleanPublicTopBar(){
    document.querySelectorAll('a[href]').forEach(a=>{
      const href=(a.getAttribute('href')||'').trim().toLowerCase();
      if(PUBLIC_LINKS.has(href) && !isAdminSideMenu(a)) a.remove();
    });
  }
  window.setPublicLoginButtonVisible = function(visible){
    const b=document.getElementById('openLogin');
    if(!b)return;
    b.style.display=visible ? '' : 'none';
    b.hidden=!visible;
    b.setAttribute('aria-hidden',visible?'false':'true');
  };
  function syncLoginButton(){
    const admin=document.getElementById('adminApp');
    const member=document.getElementById('memberApp');
    const loggedIn=!!((admin&&!admin.classList.contains('hidden'))||(member&&!member.classList.contains('hidden')));
    window.setPublicLoginButtonVisible(!loggedIn);
  }
  function cleanAndSync(){ cleanPublicTopBar(); syncLoginButton(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',cleanAndSync);
  else cleanAndSync();
  new MutationObserver(cleanAndSync).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
})();
