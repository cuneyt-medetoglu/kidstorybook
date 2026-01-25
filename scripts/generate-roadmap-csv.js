#!/usr/bin/env node

/**
 * ROADMAP.md'den CSV oluşturma script'i
 * 
 * Kullanım:
 *   node scripts/generate-roadmap-csv.js
 * 
 * Çıktı: docs/roadmap.csv
 */

const fs = require('fs');
const path = require('path');

const ROADMAP_PATH = path.join(__dirname, '../docs/ROADMAP.md');
const CSV_PATH_DOCS = path.join(__dirname, '../docs/roadmap.csv');

// Öncelik mapping (faz başlıklarından çıkarılacak)
const PRIORITY_MAP = {
  '🔴 Kritik': 'Kritik',
  '🟡 Önemli': 'Önemli',
  '🟢 Düşük': 'Düşük',
};

// Durum mapping
const STATUS_MAP = {
  '[x]': 'Tamamlandı',
  '[ ]': 'Bekliyor',
  '⏸️': 'Ertelendi',
  '📝': 'Draft',
};

// Kategori mapping (Faz ve Alt Faz'a göre)
function getCategory(faz, altFaz, currentAltFazName) {
  const fazNum = parseInt(faz);
  const altFazNum = altFaz ? parseInt(altFaz.split('.')[1]) : null;
  
  // Faz bazlı kategoriler
  if (fazNum === 1) return 'Altyapı';
  if (fazNum === 2) {
    // Faz 2 alt kategorileri
    if (altFazNum === 1) return 'Frontend - Layout';
    if (altFazNum === 2) return 'Frontend - Ana Sayfa';
    if (altFazNum === 3) return 'Frontend - Auth';
    if (altFazNum === 4) return 'Frontend - Wizard';
    if (altFazNum === 5) return 'Frontend - E-book Viewer';
    if (altFazNum === 6) return 'Frontend - Dashboard';
    if (altFazNum === 7) return 'Frontend - Statik Sayfalar';
    return 'Frontend';
  }
  if (fazNum === 3) {
    // Faz 3 alt kategorileri
    if (altFazNum === 1) return 'Backend - API';
    if (altFazNum === 2) return 'Backend - Database';
    if (altFazNum === 3) return 'Backend - Storage';
    if (altFazNum === 4) return 'Backend - Auth';
    if (altFazNum === 5) return 'AI - Entegrasyon';
    if (altFazNum === 6) return 'Backend - Kitap API';
    if (altFazNum === 7) return 'Backend - Webhook';
    return 'Backend / AI';
  }
  if (fazNum === 4) {
    if (altFazNum === 1) return 'E-ticaret - Stripe';
    if (altFazNum === 2) return 'E-ticaret - İyzico';
    if (altFazNum === 3) return 'E-ticaret - Sipariş';
    if (altFazNum === 4) return 'E-ticaret - Fiyatlandırma';
    return 'E-ticaret';
  }
  if (fazNum === 5) {
    if (altFazNum === 1) return 'SEO';
    if (altFazNum === 2) return 'Analytics';
    if (altFazNum === 3) return 'Güvenlik';
    if (altFazNum === 4) return 'Test';
    if (altFazNum === 5) return 'Deployment';
    if (altFazNum === 6) return 'Lansman';
    if (altFazNum === 7) return 'PDF Tasarım';
    if (altFazNum === 8) return 'Admin Panel';
    if (altFazNum === 9) return 'Pazarlama';
    return 'Polish / Lansman';
  }
  if (fazNum === 6) return 'Mobil / PWA';
  
  return 'Diğer';
}

function parseRoadmap() {
  const content = fs.readFileSync(ROADMAP_PATH, 'utf-8');
  const lines = content.split('\n');
  
  const tasks = [];
  let currentFaz = null;
  let currentAltFaz = null;
  let currentPriority = null;
  
  // Özet ve Genel Bakış bölümlerini atla, sadece detaylı bölümlerden oku
  let skipSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Özet veya Genel Bakış bölümünü bul ve atla
    if (line.includes('## 📊 Hızlı Özet') || line.includes('## 🎯 Genel Bakış')) {
      skipSection = true;
      continue;
    }
    
    // Faz başlığı: ## 🏗️ FAZ 1: Temel Altyapı
    const fazHeaderMatch = line.match(/^## .*FAZ (\d+):/);
    if (fazHeaderMatch) {
      skipSection = false; // FAZ başlığı gelince okumaya başla
      currentFaz = fazHeaderMatch[1];
      // Öncelik bilgisini bir sonraki satırdan al
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (nextLine.includes('🔴 Kritik') || nextLine.includes('**Öncelik:** 🔴 Kritik')) {
          currentPriority = 'Kritik';
        } else if (nextLine.includes('🟡 Önemli') || nextLine.includes('**Öncelik:** 🟡 Önemli')) {
          currentPriority = 'Önemli';
        } else if (nextLine.includes('🟢 Düşük') || nextLine.includes('**Öncelik:** 🟢 Düşük')) {
          currentPriority = 'Düşük';
        }
      }
      continue;
    }
    
    // Atlanacak bölümdeyken devam etme
    if (skipSection) continue;
    
    // Alt faz başlığı: ### 1.1 Proje Kurulumu ✅
    const altFazMatch = line.match(/^### (\d+\.\d+)\s+(.+?)(?:\s+✅)?$/);
    if (altFazMatch) {
      currentAltFaz = altFazMatch[1];
      continue;
    }
    
    // İş satırı: - [x] **1.1.1** veya **2.4.2.1** Başlık - açıklama
    // Hem 3 seviyeli (1.1.1) hem de 4 seviyeli (2.4.2.1) ID'leri destekle
    // Girintili görevleri de yakala (başında boşluk olabilir)
    const taskMatch = line.match(/^\s*- \[([ x])\]\s+\*\*(\d+\.\d+\.\d+(?:\.\d+)?)\*\*\s+(.+)/);
    if (taskMatch) {
      const [, status, id, title] = taskMatch;
      const idParts = id.split('.');
      const faz = idParts[0];
      const altFaz = idParts.length >= 2 ? `${faz}.${idParts[1]}` : faz;
      
      // Başlıktan notları ayır (varsa " - " ile ayrılmış)
      const titleParts = title.trim().split(/\s+-\s+(.+)/);
      let cleanTitle = titleParts[0].trim();
      let notes = titleParts[1] ? titleParts[1].trim() : '';
      
      // Eisenhower kategorisini satırdan çıkar (format: | 🔴 DO, | 🟡 PLAN, | 🟠 DELEGATE, | ⚪ ELIMINATE)
      let priority = '';
      const eisenhowerMatch = line.match(/\|\s*(🔴\s*DO|🟡\s*PLAN|🟠\s*DELEGATE|⚪\s*ELIMINATE)/);
      if (eisenhowerMatch) {
        if (eisenhowerMatch[1].includes('DO')) priority = 'DO';
        else if (eisenhowerMatch[1].includes('PLAN')) priority = 'PLAN';
        else if (eisenhowerMatch[1].includes('DELEGATE')) priority = 'DELEGATE';
        else if (eisenhowerMatch[1].includes('ELIMINATE')) priority = 'ELIMINATE';
      }
      
      // Başlıktan Eisenhower kısmını temizle (eğer varsa)
      cleanTitle = cleanTitle.replace(/\s*\|\s*(🔴|🟡|🟠|⚪)\s*(DO|PLAN|DELEGATE|ELIMINATE).*$/, '').trim();
      
      // Mevcut task'ı bul ve güncelle
      const existingTask = tasks.find(t => t.id === id);
      if (existingTask) {
        existingTask.notlar = notes;
        if (currentPriority) existingTask.oncelik = currentPriority;
        if (priority) existingTask.priority = priority;
      } else {
        // Yeni task ekle
        tasks.push({
          id: id.trim(),
          faz: faz,
          altFaz: altFaz,
          baslik: cleanTitle,
          durum: status === 'x' ? 'Tamamlandı' : 'Bekliyor',
          oncelik: currentPriority || 'Önemli',
          kategori: getCategory(faz, altFaz, currentAltFaz),
          priority: priority, // Eisenhower Matrisi - varsayılan boş
          notlar: notes,
          tarih: '',
          link: currentAltFaz ? `#${currentAltFaz.toLowerCase().replace(/\s+/g, '-')}` : '',
        });
      }
    }
  }
  
  return tasks;
}

// Priority bilgisini ROADMAP.md'den parse et
function extractPriorityFromLine(line) {
  // Priority: [x] 🔴 DO formatını ara
  const doMatch = line.match(/\[x\]\s*🔴\s*DO/);
  if (doMatch) return 'DO';
  
  const planMatch = line.match(/\[x\]\s*🟡\s*PLAN/);
  if (planMatch) return 'PLAN';
  
  const delegateMatch = line.match(/\[x\]\s*🟠\s*DELEGATE/);
  if (delegateMatch) return 'DELEGATE';
  
  const eliminateMatch = line.match(/\[x\]\s*⚪\s*ELIMINATE/);
  if (eliminateMatch) return 'ELIMINATE';
  
  // Hiçbiri seçilmemişse boş döndür
  return '';
}

function generateCSV(tasks) {
  // CSV header
  const headers = [
    'ID',
    'Faz',
    'Alt Faz',
    'Başlık',
    'Durum',
    'Öncelik',
    'Kategori',
    'Priority',
    'Notlar',
    'Tarih',
    'Link',
  ];
  
  // CSV rows
  const rows = tasks.map(task => {
    // ID kolonunu Excel/Google Sheets'te metin olarak algılaması için başına tab karakteri ekle
    // Bu sayede 1.1.1 gibi değerler tarih olarak algılanmaz
    // Alternatif: ="1.1.1" formatı da çalışır ama tab daha temiz
    const idValue = `\t${task.id}`;
    
    // Priority bilgisi task objesinde yoksa boş bırak
    const priority = task.priority || '';
    
    return [
      idValue,
      task.faz,
      task.altFaz,
      `"${task.baslik.replace(/"/g, '""')}"`, // CSV escape
      task.durum,
      task.oncelik,
      task.kategori,
      priority, // Priority kolonu (Eisenhower Matrisi)
      `"${task.notlar.replace(/"/g, '""')}"`,
      task.tarih,
      task.link,
    ].join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
}

// Ana işlem
try {
  console.log('📖 ROADMAP.md okunuyor...');
  const tasks = parseRoadmap();
  console.log(`✅ ${tasks.length} iş bulundu`);
  
  console.log('📊 CSV oluşturuluyor...');
  const csv = generateCSV(tasks);
  
  // CSV'yi docs/ klasörüne yaz
  fs.writeFileSync(CSV_PATH_DOCS, csv, 'utf-8');
  console.log(`✅ CSV oluşturuldu:`);
  console.log(`   - ${CSV_PATH_DOCS}`);
  console.log(`\n📋 İstatistikler:`);
  console.log(`   - Toplam iş: ${tasks.length}`);
  console.log(`   - Tamamlanan: ${tasks.filter(t => t.durum === 'Tamamlandı').length}`);
  console.log(`   - Bekleyen: ${tasks.filter(t => t.durum === 'Bekliyor').length}`);
  
} catch (error) {
  console.error('❌ Hata:', error.message);
  process.exit(1);
}
