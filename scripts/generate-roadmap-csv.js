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
      const cleanTitle = titleParts[0].trim();
      const notes = titleParts[1] ? titleParts[1].trim() : '';
      
      // Mevcut task'ı bul ve güncelle
      const existingTask = tasks.find(t => t.id === id);
      if (existingTask) {
        existingTask.notlar = notes;
        if (currentPriority) existingTask.oncelik = currentPriority;
      } else {
        // Yeni task ekle
        tasks.push({
          id: id.trim(),
          faz: faz,
          altFaz: altFaz,
          baslik: cleanTitle,
          durum: status === 'x' ? 'Tamamlandı' : 'Bekliyor',
          oncelik: currentPriority || 'Önemli',
          kategori: 'İş',
          notlar: notes,
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
