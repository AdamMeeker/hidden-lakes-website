/**
 * Hidden Lakes - Premium Estate Living
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initLotMap();
    initGallery();
    initLightbox();
    initContactForm();
    initScrollAnimations();
});

/* =====================================================
   NAVIGATION
   ===================================================== */

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Scroll effect for navbar
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =====================================================
   LOT MAP - Interactive Site Plan
   ===================================================== */

// Lot data — from Exhibit A (Hidden Lakes Characteristics by Lot Pricing).
// Polygon points (normalized 0..1 to images/site-plan.jpg) from the lot-tracer export.
// To mark a lot reserved/sold, change its `status` to 'reserved' or 'sold'.
const lotData = [
  {"id":1,"status":"available","acres":1.01,"sf":43977,"dim":"152 x 289","road":"Hidden Lakes Crossing","type":"Walkout","features":"Corner Lot, Pond View","price":"$265,000","poly":[[0.439,0.32783],[0.4685,0.44186],[0.5285,0.43136],[0.4825,0.29707]]},
  {"id":2,"status":"available","acres":1.01,"sf":44085,"dim":"139 x 317","road":"Hidden Lakes Crossing","type":"Walkout","features":"Pond View","price":"$265,000","poly":[[0.4815,0.29482],[0.532,0.26482],[0.568,0.42086],[0.5305,0.43211]]},
  {"id":3,"status":"available","acres":1.02,"sf":44568,"dim":"137 x 325","road":"Hidden Lakes Crossing","type":"Walkout","features":"Pond View","price":"$265,000","poly":[[0.5345,0.26407],[0.584,0.24681],[0.601,0.4051],[0.5705,0.42086]]},
  {"id":4,"status":"available","acres":1,"sf":43579,"dim":"145 x 298","road":"Hidden Lakes Crossing","type":"Walkout","features":"Pond View","price":"$265,000","poly":[[0.5885,0.24531],[0.642,0.24081],[0.6435,0.37359],[0.6025,0.4036]]},
  {"id":5,"status":"available","acres":1.01,"sf":43877,"dim":"162 x 269","road":"Hidden Lakes Crossing","type":"Walkout","features":"Pond View","price":"$265,000","poly":[[0.699,0.37659],[0.647,0.37659],[0.642,0.24456],[0.6955,0.24006]]},
  {"id":6,"status":"available","acres":1.02,"sf":42246,"dim":"164 x 269","road":"Hidden Lakes Crossing","type":"Walkout","features":"","price":"$250,000","poly":[[0.7035,0.37284],[0.701,0.24081],[0.753,0.23856],[0.7545,0.37284]]},
  {"id":7,"status":"available","acres":1.07,"sf":46404,"dim":"172 x 269","road":"Hidden Lakes Crossing","type":"Walkout","features":"Corner Lot (HLC & PW)","price":"$250,000","poly":[[0.756,0.37284],[0.7525,0.23856],[0.805,0.24231],[0.811,0.37284]]},
  {"id":8,"status":"available","acres":1.22,"sf":52999,"dim":"158 x 335","road":"Prairie Way","type":"Walkout","features":"Premium Lot, Pond View","price":"$310,000","poly":[[0.698,0.37959],[0.812,0.37734],[0.8135,0.44936],[0.702,0.45311]]},
  {"id":9,"status":"available","acres":1.04,"sf":45191,"dim":"145 x 314","road":"Lakeview Avenue","type":"Walkout","features":"Corner Lot (LV & PW)","price":"$250,000","poly":[[0.767,0.45686],[0.812,0.45686],[0.814,0.60465],[0.767,0.61365]]},
  {"id":10,"status":"available","acres":1.02,"sf":44272,"dim":"137 x 322","road":"Lakeview Avenue","type":"Walkout","features":"","price":"$250,000","poly":[[0.762,0.45536],[0.766,0.61365],[0.7195,0.6174],[0.7185,0.45686]]},
  {"id":11,"status":"available","acres":1.02,"sf":44317,"dim":"137 x 323","road":"Lakeview Avenue","type":"Walkout","features":"Partial Pond View","price":"$265,000","poly":[[0.7155,0.45686],[0.6735,0.46137],[0.675,0.61815],[0.7185,0.61515]]},
  {"id":12,"status":"available","acres":1.01,"sf":44075,"dim":"142 x 311","road":"Lakeview Avenue","type":"Walkout","features":"Pond View","price":"$265,000","poly":[[0.6715,0.45761],[0.627,0.47262],[0.627,0.61965],[0.6735,0.61815]]},
  {"id":13,"status":"available","acres":1.36,"sf":58631,"dim":"Pie shape","road":"Lakeview Avenue","type":"Walkout","features":"Premium Lot, Dual Pond View","price":"$275,000","poly":[[0.6245,0.47862],[0.519,0.57014],[0.5635,0.61965],[0.624,0.62041]]},
  {"id":14,"status":"available","acres":1.63,"sf":70798,"dim":"170 x 416","road":"Lakeview Avenue","type":"Walkout","features":"Premium Lot, Woodland","price":"$300,000","poly":[[0.504,0.60465],[0.539,0.64591],[0.5115,0.76519],[0.4325,0.76969],[0.4295,0.69617]]},
  {"id":15,"status":"available","acres":1.14,"sf":49817,"dim":"195 x 255","road":"Lakeview Avenue","type":"Walkout","features":"Corner Lot (LA & BL)","price":"$260,000","poly":[[0.539,0.64141],[0.5965,0.65866],[0.598,0.76369],[0.5175,0.77194]]},
  {"id":16,"status":"available","acres":1.43,"sf":62459,"dim":"220 x 284","road":"Lakeview Avenue","type":"Walkout","features":"Corner Lot (LA & BL)","price":"$240,000","poly":[[0.6175,0.65941],[0.6175,0.76369],[0.712,0.76369],[0.71,0.65716]]},
  {"id":17,"status":"available","acres":1.42,"sf":61994,"dim":"226 x 273","road":"Lakeview Avenue","type":"Walkout","features":"","price":"$240,000","poly":[[0.711,0.65641],[0.802,0.64666],[0.806,0.76294],[0.712,0.76294]]},
  {"id":18,"status":"available","acres":1.48,"sf":64634,"dim":"275 x 234","road":"Lakeview Avenue","type":"Walkout","features":"","price":"$240,000","poly":[[0.806,0.64366],[0.892,0.64216],[0.8975,0.75619],[0.806,0.76069]]},
  {"id":19,"status":"available","acres":0.58,"sf":25108,"dim":"134 x 188","road":"Prairie Way","type":"Daylight","features":"","price":"$190,000","poly":[[0.832,0.53938],[0.8325,0.6054],[0.8905,0.60315],[0.8935,0.53938]]},
  {"id":20,"status":"available","acres":0.54,"sf":23500,"dim":"125 x 188","road":"Prairie Way","type":"Daylight","features":"","price":"$190,000","poly":[[0.831,0.47712],[0.832,0.53713],[0.8955,0.53938],[0.8935,0.47637]]},
  {"id":21,"status":"available","acres":0.54,"sf":23500,"dim":"125 x 188","road":"Prairie Way","type":"Daylight","features":"","price":"$190,000","poly":[[0.831,0.47487],[0.8295,0.41785],[0.893,0.41185],[0.893,0.47337]]},
  {"id":22,"status":"available","acres":0.62,"sf":27151,"dim":"145 x 188","road":"Prairie Way","type":"Daylight","features":"","price":"$190,000","poly":[[0.828,0.30533],[0.828,0.37359],[0.8915,0.37359],[0.892,0.30308]]},
  {"id":23,"status":"available","acres":0.63,"sf":27282,"dim":"119 x 230","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$190,000","poly":[[0.844,0.20405],[0.8845,0.22506],[0.89,0.21455],[0.8905,0.10353],[0.861,0.09827]]},
  {"id":24,"status":"available","acres":0.56,"sf":24263,"dim":"115 x 211","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$210,000","poly":[[0.8435,0.2018],[0.815,0.2018],[0.812,0.10203],[0.861,0.09977]]},
  {"id":25,"status":"available","acres":1,"sf":43617,"dim":"212 x 206","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$220,000","poly":[[0.8125,0.2018],[0.743,0.2033],[0.741,0.10653],[0.815,0.10128]]},
  {"id":26,"status":"available","acres":1,"sf":43629,"dim":"211 x 206","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$220,000","poly":[[0.74,0.09977],[0.7415,0.2033],[0.6715,0.2033],[0.6705,0.10653]]},
  {"id":27,"status":"available","acres":1,"sf":43644,"dim":"211 x 207","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$225,000","poly":[[0.6695,0.10578],[0.5965,0.10578],[0.6025,0.20405],[0.6705,0.2033]]},
  {"id":28,"status":"available","acres":1,"sf":43657,"dim":"189 x 230","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$225,000","poly":[[0.598,0.10803],[0.526,0.10578],[0.5435,0.22281],[0.6015,0.21005]]},
  {"id":29,"status":"available","acres":1,"sf":43655,"dim":"302 x 220","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$225,000","poly":[[0.526,0.10878],[0.461,0.10428],[0.5,0.24906],[0.542,0.22281]]},
  {"id":30,"status":"available","acres":1.43,"sf":62196,"dim":"206 x 302","road":"Hidden Lakes Crossing","type":"Daylight","features":"Corner Lot (HLC & LA)","price":"$250,000","poly":[[0.46,0.10578],[0.409,0.10578],[0.423,0.16654],[0.426,0.28882],[0.501,0.24531]]},
  {"id":31,"status":"available","acres":1.35,"sf":58926,"dim":"163 x 360","road":"Lakeview Avenue","type":"Daylight","features":"","price":"$230,000","poly":[[0.3855,0.10803],[0.4005,0.16504],[0.3985,0.1928],[0.276,0.1913],[0.2735,0.10803]]},
  {"id":32,"status":"available","acres":1.35,"sf":58987,"dim":"158 x 372","road":"Lakeview Avenue","type":"Daylight","features":"","price":"$230,000","poly":[[0.2745,0.19055],[0.2735,0.28582],[0.4,0.25131],[0.399,0.19055]]},
  {"id":33,"status":"available","acres":1.33,"sf":57896,"dim":"132 x 167","road":"Lakeview Avenue","type":"Daylight","features":"Corner Lot (LA & HLC)","price":"$250,000","poly":[[0.285,0.29032],[0.285,0.37284],[0.337,0.35934],[0.402,0.32033],[0.3985,0.24981]]},
  {"id":34,"status":"available","acres":0.51,"sf":22333,"dim":"133 x 168","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$220,000","poly":[[0.263,0.29482],[0.2195,0.29482],[0.2185,0.37284],[0.262,0.37059]]},
  {"id":35,"status":"available","acres":0.51,"sf":22338,"dim":"135 x 165","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$220,000","poly":[[0.2195,0.29482],[0.217,0.37359],[0.1745,0.37509],[0.1695,0.29032]]},
  {"id":36,"status":"available","acres":0.55,"sf":24078,"dim":"141 x 170","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$220,000","poly":[[0.1705,0.29332],[0.1125,0.29482],[0.147,0.3901],[0.1715,0.37284]]},
  {"id":37,"status":"available","acres":1.01,"sf":44115,"dim":"140 x 315","road":"Hidden Lakes Crossing","type":"Daylight","features":"","price":"$225,000","poly":[[0.1125,0.29482],[0.051,0.29557],[0.0505,0.33833],[0.1225,0.42086],[0.1455,0.3886]]},
  {"id":38,"status":"available","acres":1.01,"sf":43998,"dim":"180 x 240","road":"Hidden Lakes Crossing","type":"Daylight","features":"Cul-de-sac","price":"$225,000","poly":[[0.051,0.34284],[0.051,0.48612],[0.103,0.48987],[0.1225,0.42236]]},
  {"id":39,"status":"available","acres":1.05,"sf":45790,"dim":"175 x 260","road":"Hidden Lakes Court","type":"Walkout","features":"Corner (HLC & HLC), Cul-de-sac","price":"$255,000","poly":[[0.0505,0.52663],[0.11,0.53338],[0.1085,0.57614],[0.1185,0.62491],[0.051,0.68117]]},
  {"id":40,"status":"available","acres":1.02,"sf":44487,"dim":"","road":"Hidden Lakes Court","type":"Walkout","features":"Premium Lot, Cul-de-sac","price":"$255,000","poly":[[0.052,0.67817],[0.0505,0.77644],[0.074,0.77869],[0.1375,0.66167],[0.1175,0.62866]]},
  {"id":41,"status":"available","acres":1.03,"sf":44941,"dim":"","road":"Hidden Lakes Court","type":"Walkout","features":"Premium Lot, Cul-de-sac","price":"$255,000","poly":[[0.1385,0.66317],[0.077,0.77644],[0.1735,0.77344],[0.182,0.68792]]},
  {"id":42,"status":"available","acres":1.01,"sf":44081,"dim":"","road":"Hidden Lakes Court","type":"Walkout","features":"Premium Lot, Pond View, Cul-de-sac","price":"$270,000","poly":[[0.1845,0.68942],[0.1765,0.77119],[0.2945,0.77194],[0.2945,0.75694],[0.2195,0.68567],[0.2035,0.70068]]},
  {"id":43,"status":"available","acres":1.13,"sf":49107,"dim":"","road":"Hidden Lakes Court","type":"Walkout","features":"Deluxe Lot, Dual Pond View, Woodland, Cul-de-sac","price":"$325,000","poly":[[0.2215,0.68567],[0.22,0.65641],[0.275,0.6024],[0.3155,0.69767],[0.295,0.75169]]},
  {"id":44,"status":"available","acres":1.18,"sf":51545,"dim":"","road":"Hidden Lakes Court","type":"Walkout","features":"Deluxe Lot, Cul-de-sac","price":"$325,000","poly":[[0.194,0.64216],[0.2095,0.64141],[0.2195,0.65416],[0.2745,0.59865],[0.2645,0.52288],[0.1935,0.52213]]},
  {"id":45,"status":"available","acres":1.07,"sf":46692,"dim":"","road":"Hidden Lakes Court","type":"Walkout","features":"Premium Lot, Pond View","price":"$250,000","poly":[[0.192,0.64216],[0.1835,0.65866],[0.1505,0.64366],[0.137,0.62041],[0.126,0.5829],[0.129,0.52438],[0.1925,0.52288]]},
  {"id":46,"status":"available","acres":1.02,"sf":44366,"dim":"","road":"Hidden Lakes Court","type":"Walkout","features":"Premium Lot","price":"$250,000","poly":[[0.2065,0.41185],[0.179,0.4126],[0.1545,0.42911],[0.1355,0.46587],[0.13,0.51838],[0.205,0.52063]]},
  {"id":47,"status":"available","acres":1,"sf":43662,"dim":"","road":"Hidden Lakes Court","type":"Walkout","features":"Premium Lot, Green Space","price":"$275,000","poly":[[0.207,0.41185],[0.207,0.51763],[0.262,0.51838],[0.2735,0.48162],[0.2785,0.4141]]},
  {"id":48,"status":"available","acres":1.08,"sf":47125,"dim":"136 x 348","road":"Lakeview Avenue","type":"Walkout","features":"Premium, Corner Lot (LA & HLC)","price":"$300,000","poly":[[0.3135,0.4051],[0.322,0.47337],[0.435,0.41185],[0.4145,0.34884],[0.3685,0.38785]]},
  {"id":49,"status":"available","acres":1.04,"sf":45091,"dim":"127 x 355","road":"Lakeview Avenue","type":"Walkout","features":"Premium Lot, Pond View","price":"$320,000","poly":[[0.3225,0.47262],[0.337,0.53488],[0.447,0.46437],[0.4345,0.41635]]},
  {"id":50,"status":"available","acres":1.17,"sf":50996,"dim":"135 x 375","road":"Lakeview Avenue","type":"Walkout","features":"Deluxe Lot, Dual Pond & Wood View","price":"$340,000","poly":[[0.3385,0.53713],[0.354,0.6099],[0.4655,0.52063],[0.449,0.47262]]}
];


function lotView(l){ const f=(l.features||'').toLowerCase(); if(f.indexOf('pond')>-1) return 'Lake View'; if(f.indexOf('wood')>-1) return 'Wooded'; return 'Standard'; }
function statusLabel(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function statusText(s){ return s==='available' ? 'For Sale' : statusLabel(s); }

function initLotMap() {
    const panel = document.getElementById('lotDetailPanel');
    const panelClose = document.getElementById('panelClose');
    const sizeFilter = document.getElementById('lotSizeFilter');
    const viewFilter = document.getElementById('lotViewFilter');

    renderLotOverlay();
    updateLotStats();

    if (panelClose) panelClose.addEventListener('click', closeLotPanel);
    document.addEventListener('click', function(e){
        if (panel.classList.contains('active') && !panel.contains(e.target) && !e.target.closest('.lot')) closeLotPanel();
    });
    if (sizeFilter) sizeFilter.addEventListener('change', filterLots);
    if (viewFilter) viewFilter.addEventListener('change', filterLots);
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && panel.classList.contains('active')) closeLotPanel(); });
}

// Touch devices have no hover: a tap fires hover+click together. So on touch we
// show a tap-to-preview card (with a "View full details" button) instead of
// jumping straight into the detail panel.
const SUPPORTS_HOVER = !(window.matchMedia && window.matchMedia('(hover: none)').matches);

let lotTooltip = null;
function ensureTooltip(){
    if (lotTooltip) return lotTooltip;
    lotTooltip = document.createElement('div');
    lotTooltip.className = 'lot-tooltip';
    (document.querySelector('.lot-map-wrapper') || document.body).appendChild(lotTooltip);
    return lotTooltip;
}

function tooltipHTML(lot, withButton){
    return '<div class="lt-head"><span class="lt-num">Lot ' + lot.id + '</span>' +
        '<span class="lt-status ' + lot.status + '">' + statusText(lot.status) + '</span></div>' +
        '<div class="lt-row"><span>Size</span><b>' + lot.acres.toFixed(2) + ' ac &middot; ' + lot.sf.toLocaleString() + ' sf</b></div>' +
        (lot.features ? '<div class="lt-row"><span>Amenities</span><b>' + lot.features + '</b></div>' : '') +
        '<div class="lt-row"><span>Price</span><b>' + lot.price + '</b></div>' +
        (withButton
            ? '<button type="button" class="lt-btn" data-lot="' + lot.id + '">View full details</button>'
            : '<div class="lt-foot">Click for full details</div>');
}

function renderLotOverlay(){
    const svg = document.getElementById('lotOverlay');
    if (!svg) return;
    const vb = (svg.getAttribute('viewBox') || '0 0 1200 800').split(/\s+/).map(Number);
    const W = vb[2] || 1200, H = vb[3] || 800;
    const NS = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';
    lotData.forEach(function(lot){
        if (!lot.poly || !lot.poly.length) return;
        const p = document.createElementNS(NS, 'polygon');
        p.setAttribute('points', lot.poly.map(function(pt){ return (pt[0]*W).toFixed(1)+','+(pt[1]*H).toFixed(1); }).join(' '));
        p.setAttribute('class', 'lot ' + lot.status);
        p.setAttribute('data-id', lot.id);
        if (SUPPORTS_HOVER) {
            p.addEventListener('mouseenter', function(e){ showTooltip(e, lot); });
            p.addEventListener('mousemove', moveTooltip);
            p.addEventListener('mouseleave', hideTooltip);
            p.addEventListener('click', function(e){ e.stopPropagation(); showLotInfo(lot.id); });
        } else {
            p.addEventListener('click', function(e){ e.stopPropagation(); showLotCard(lot, p); });
        }
        svg.appendChild(p);
    });

    // Dismiss the touch preview card when tapping elsewhere
    if (!SUPPORTS_HOVER && !renderLotOverlay._dismissBound) {
        document.addEventListener('click', function(e){
            if (lotTooltip && lotTooltip.style.display === 'block' &&
                !lotTooltip.contains(e.target) && !(e.target.closest && e.target.closest('.lot'))) {
                hideTooltip();
            }
        });
        renderLotOverlay._dismissBound = true;
    }
}

// Desktop: cursor-following tooltip
function showTooltip(e, lot){
    const t = ensureTooltip();
    t.className = 'lot-tooltip';
    t.innerHTML = tooltipHTML(lot, false);
    t.style.display = 'block';
    moveTooltip(e);
}
function moveTooltip(e){
    if (!lotTooltip) return;
    const wrap = document.querySelector('.lot-map-wrapper');
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const tw = lotTooltip.offsetWidth, th = lotTooltip.offsetHeight;
    let x = e.clientX - r.left + 14, y = e.clientY - r.top + 14;
    if (x + tw > r.width) x = e.clientX - r.left - tw - 14;
    if (y + th > r.height) y = e.clientY - r.top - th - 14;
    lotTooltip.style.left = Math.max(4, x) + 'px';
    lotTooltip.style.top = Math.max(4, y) + 'px';
}

// Touch: tap shows an anchored card with a button to open the full panel
function showLotCard(lot, polyEl){
    const t = ensureTooltip();
    t.className = 'lot-tooltip touch';
    t.innerHTML = tooltipHTML(lot, true);
    t.style.display = 'block';
    const wrap = document.querySelector('.lot-map-wrapper');
    const wr = wrap.getBoundingClientRect();
    const lr = polyEl.getBoundingClientRect();
    const tw = t.offsetWidth, th = t.offsetHeight;
    let x = (lr.left - wr.left) + (lr.width / 2) - (tw / 2);
    let y = (lr.top - wr.top) - th - 10;            // prefer above the lot
    if (y < 4) y = (lr.bottom - wr.top) + 10;        // not enough room → below
    x = Math.max(4, Math.min(x, wr.width - tw - 4));
    y = Math.max(4, Math.min(y, wr.height - th - 4));
    t.style.left = x + 'px';
    t.style.top = y + 'px';
    const btn = t.querySelector('.lt-btn');
    if (btn) btn.addEventListener('click', function(e){ e.stopPropagation(); hideTooltip(); showLotInfo(lot.id); });
}

function hideTooltip(){ if (lotTooltip) lotTooltip.style.display = 'none'; }

function showLotInfo(lotId) {
    const lot = lotData.find(function(l){ return l.id === lotId; });
    if (!lot) return;
    const panel = document.getElementById('lotDetailPanel');
    document.getElementById('lotNumber').textContent = lot.id;
    const st = document.getElementById('lotStatus');
    st.textContent = statusText(lot.status);
    st.className = 'lot-detail-status ' + lot.status;
    document.getElementById('lotSize').textContent = lot.acres.toFixed(2) + ' ac (' + lot.sf.toLocaleString() + ' sf)';
    document.getElementById('lotView').textContent = (lot.type === 'Daylight' ? 'Daylight' : 'Walk-Out') + (lotView(lot) !== 'Standard' ? ' · ' + lotView(lot) : '');
    document.getElementById('lotPrice').textContent = lot.price;
    const desc = [];
    if (lot.features) desc.push(lot.features + '.');
    desc.push('Located on ' + lot.road + '.');
    if (lot.dim) desc.push('Approx. dimensions ' + lot.dim + '.');
    desc.push(lot.type === 'Daylight' ? 'Daylight lot.' : 'Walk-out (W/O) lot.');
    document.getElementById('lotDescription').textContent = desc.join(' ');
    const btn = document.querySelector('.lot-inquiry-btn');
    if (btn) btn.setAttribute('data-lot', lot.id);
    panel.classList.add('active');
    hideTooltip();
}

function closeLotPanel() {
    const p = document.getElementById('lotDetailPanel');
    if (p) p.classList.remove('active');
}

function filterLots() {
    const sizeF = document.getElementById('lotSizeFilter').value;
    const viewF = document.getElementById('lotViewFilter').value;
    document.querySelectorAll('#lotOverlay .lot').forEach(function(el){
        const lot = lotData.find(function(l){ return l.id === parseInt(el.getAttribute('data-id'), 10); });
        if (!lot) return;
        let ok = true;
        if (sizeF === 'small') ok = ok && lot.acres < 1.0;
        else if (sizeF === 'medium') ok = ok && lot.acres >= 1.0 && lot.acres <= 1.5;
        else if (sizeF === 'large') ok = ok && lot.acres > 1.5;
        if (viewF === 'lake') ok = ok && lotView(lot) === 'Lake View';
        else if (viewF === 'woods') ok = ok && lotView(lot) === 'Wooded';
        el.classList.toggle('dimmed', !ok);
    });
}

function updateLotStats() {
    const a = document.getElementById('availableCount');
    const lv = document.getElementById('lakeViewCount');
    if (a) a.textContent = lotData.filter(function(l){ return l.status === 'available'; }).length;
    if (lv) lv.textContent = lotData.filter(function(l){ return lotView(l) === 'Lake View'; }).length;
}

/* =====================================================
   GALLERY
   ===================================================== */

function initGallery() {
    const tabs = document.querySelectorAll('.gallery-tab');
    const panels = document.querySelectorAll('.gallery-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update active panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab + '-panel') {
                    panel.classList.add('active');
                }
            });
        });
    });

    // Gallery item click for lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-item-overlay span');
            openLightbox(img.src, caption ? caption.textContent : '');
        });
    });
}

/* =====================================================
   LIGHTBOX
   ===================================================== */

let currentLightboxIndex = 0;
const galleryImages = [];

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // Collect all gallery images
    document.querySelectorAll('.gallery-item img').forEach((img, index) => {
        const caption = img.closest('.gallery-item').querySelector('.gallery-item-overlay span');
        galleryImages.push({
            src: img.src,
            caption: caption ? caption.textContent : ''
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
}

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    // Find current index
    currentLightboxIndex = galleryImages.findIndex(img => img.src === src);

    lightboxImage.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;

    if (currentLightboxIndex < 0) {
        currentLightboxIndex = galleryImages.length - 1;
    } else if (currentLightboxIndex >= galleryImages.length) {
        currentLightboxIndex = 0;
    }

    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    lightboxImage.src = galleryImages[currentLightboxIndex].src;
    lightboxCaption.textContent = galleryImages[currentLightboxIndex].caption;
}

/* =====================================================
   CONTACT FORM
   ===================================================== */

function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');
    const RECIPIENT = 'hiddenlakesia@gmail.com';

    function showStatus(html, type) {
        if (!statusEl) { alert(html.replace(/<[^>]+>/g, '')); return; }
        statusEl.innerHTML = html;
        statusEl.className = 'form-status ' + (type || '');
        statusEl.style.display = 'block';
    }

    function showEmailFallback(p) {
        const subject = encodeURIComponent('Hidden Lakes inquiry — ' + p.firstName + ' ' + p.lastName);
        const body = encodeURIComponent(
            'Name: ' + p.firstName + ' ' + p.lastName + '\n' +
            'Email: ' + p.email + '\n' +
            'Phone: ' + (p.phone || '') + '\n' +
            'Interested in: ' + (p.interest || '') + '\n' +
            'Lot: ' + (p.lotInterest || '') + '\n\n' +
            (p.message || '')
        );
        showStatus(
            "We couldn't submit the form just now. Please email us directly at " +
            '<a href="mailto:' + RECIPIENT + '?subject=' + subject + '&body=' + body + '">' + RECIPIENT + '</a>' +
            " and we'll respond right away.",
            'error'
        );
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const payload = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            interest: document.getElementById('interest').value,
            lotInterest: document.getElementById('lotInterest').value.trim(),
            message: document.getElementById('message').value.trim(),
            updates: form.querySelector('input[name="updates"]').checked,
            _gotcha: (form.querySelector('input[name="_gotcha"]') || {}).value || ''
        };

        if (!payload.firstName || !payload.lastName || !payload.email) {
            showStatus('Please fill in your first name, last name, and email.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        showStatus('', '');
        if (statusEl) statusEl.style.display = 'none';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                form.reset();
                showStatus("Thank you! We've received your message and will be in touch soon.", 'success');
            } else {
                showEmailFallback(payload);
            }
        } catch (err) {
            showEmailFallback(payload);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Pre-fill lot interest from lot panel inquiry button
    document.querySelectorAll('.lot-inquiry-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lotId = this.getAttribute('data-lot');
            if (lotId) {
                document.getElementById('lotInterest').value = 'Lot ' + lotId;
                document.getElementById('interest').value = 'lot';
            }
            closeLotPanel();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */

function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.feature-card, .location-card, .section-header').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero (optional, subtle)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });
}

/* =====================================================
   UTILITY FUNCTIONS
   ===================================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
