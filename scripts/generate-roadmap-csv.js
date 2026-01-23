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

function parseRoadmap() {
  const content = fs.readFileSync(ROADMAP_PATH, 'utf-8');
  const lines = content.split('\n');
  
  const tasks = [];
  let currentFaz = null;
  let currentAltFaz = null;
  let currentPriority = null;
  
  // Özet bölümünden işleri parse et
  let inSummarySection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Özet bölümünü bul
    if (line.includes('## 📊 Hızlı Özet')) {
      inSummarySection = true;
      continue;
    }
    
    // Genel Bakış'a gelince özet bölümü bitti
    if (inSummarySection && line.includes('## 🎯 Genel Bakış')) {
      break;
    }
    
    if (!inSummarySection) continue;
    
    // Faz başlığı
    const fazMatch = line.match(/^### Faz (\d+):/);
    if (fazMatch) {
      currentFaz = fazMatch[1];
      continue;
    }
    
    // Alt faz başlığı (opsiyonel, şimdilik atlayalım)
    
    // İş satırı: - [x] [1.1.1 Başlık](#link)
    const taskMatch = line.match(/^- \[([ x])\] \[(\d+\.\d+\.\d+)\s+(.+?)\]\(#(.+?)\)/);
    if (taskMatch) {
      const [, status, id, title, link] = taskMatch;
      const [faz, altFaz] = id.split('.');
      
      tasks.push({
        id: id.trim(),
        faz: faz,
        altFaz: `${faz}.${altFaz}`,
        baslik: title.trim(),
        durum: status === 'x' ? 'Tamamlandı' : 'Bekliyor',
        oncelik: currentPriority || 'Önemli', // Varsayılan
        kategori: 'İş',
        notlar: '',
        tarih: '',
        link: `#${link}`,
      });
      continue;
    }
    
    // İş satırı (link olmayan): - [x] **1.1.1** Başlık
    const taskMatch2 = line.match(/^- \[([ x])\]\s+\*\*(\d+\.\d+\.\d+)\*\*\s+(.+)/);
    if (taskMatch2) {
      const [, status, id, title] = taskMatch2;
      const [faz, altFaz] = id.split('.');
      
      // Link'i oluştur (alt faz başlığından)
      const link = currentAltFaz ? `#${currentAltFaz.toLowerCase().replace(/\s+/g, '-')}` : '';
      
      tasks.push({
        id: id.trim(),
        faz: faz,
        altFaz: `${faz}.${altFaz}`,
        baslik: title.trim(),
        durum: status === 'x' ? 'Tamamlandı' : 'Bekliyor',
        oncelik: currentPriority || 'Önemli',
        kategori: 'İş',
        notlar: '',
        tarih: '',
        link: link,
      });
    }
  }
  
  // Detaylı bölümlerden de işleri parse et (daha detaylı bilgi için)
  inSummarySection = false;
  currentFaz = null;
  currentAltFaz = null;
  currentPriority = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Faz başlığı: ## 🏗️ FAZ 1: Temel Altyapı
    const fazHeaderMatch = line.match(/^## .*FAZ (\d+):/);
    if (fazHeaderMatch) {
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
    
    // Alt faz başlığı: ### 1.1 Proje Kurulumu ✅
    const altFazMatch = line.match(/^### (\d+\.\d+)\s+(.+?)(?:\s+✅)?$/);
    if (altFazMatch) {
      currentAltFaz = altFazMatch[1];
      continue;
    }
    
    // İş satırı: - [x] **1.1.1** Başlık - açıklama
    const taskMatch = line.match(/^- \[([ x])\]\s+\*\*(\d+\.\d+\.\d+)\*\*\s+(.+?)(?:\s+-\s+(.+))?$/);
    if (taskMatch) {
      const [, status, id, title, notes] = taskMatch;
      const [faz, altFaz] = id.split('.');
      
      // Mevcut task'ı bul ve güncelle
      const existingTask = tasks.find(t => t.id === id);
      if (existingTask) {
        existingTask.notlar = notes ? notes.trim() : '';
        if (currentPriority) existingTask.oncelik = currentPriority;
      } else {
        // Yeni task ekle
        tasks.push({
          id: id.trim(),
          faz: faz,
          altFaz: `${faz}.${altFaz}`,
          baslik: title.trim(),
          durum: status === 'x' ? 'Tamamlandı' : 'Bekliyor',
          oncelik: currentPriority || 'Önemli',
          kategori: 'İş',
          notlar: notes ? notes.trim() : '',
          tarih: '',
          link: currentAltFaz ? `#${currentAltFaz.toLowerCase().replace(/\s+/g, '-')}` : '',
        });
      }
    }
  }
  
  return tasks;
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
    
    return [
      idValue,
      task.faz,
      task.altFaz,
      `"${task.baslik.replace(/"/g, '""')}"`, // CSV escape
      task.durum,
      task.oncelik,
      task.kategori,
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
