# 🤝 CONTRIBUTING GUIDE

Bu proje bir **monorepo** yapısına sahiptir ve aşağıdaki kurallar tüm ekip üyeleri için zorunludur.

---

## 📁 1. Repository Structure

```
frontend/    → React (UI)
backend/     → Node.js + TypeScript + Express
ai/          → Python (Scraping, RAG, Fine-tuning Prep)
database/    → SQL schemas, migrations
data/        → Raw & processed datasets
infra/       → AWS configs
.github/     → CI/CD workflows (GitHub Actions)
```

---

## 🌿 2. Branch Strategy

**Ana Branch’ler:**
- main → Production
- dev → Development

**Tüm çalışmalar feature branch üzerinde yapılır:**

```
feature/<task-name>
```

**Örnek:**
- feature/backend-auth  
- feature/frontend-navbar  
- feature/ai-rag  
- feature/db-schema  

❌ main’e direkt push  
❌ dev’e direkt push  

✔ feature branch → PR → dev

---

## 🧪 3. Commit Rules

Commit şu durumlarda yapılır:

- Bir fonksiyon tamamlandığında  
- UI component bittiğinde  
- Route/endpoint tamamlandığında  
- SQL schema yazıldığında  
- Dokümantasyon güncellendiğinde  

**Commit message formatı:**

- feat: add interview start endpoint  
- fix: resolve auth token bug  
- refactor: clean interview service  
- docs: update contributing guide  

**Kaçınılması gereken commit içerikleri:**

- Gereksiz console.log  
- Broken code  
- Format karmaşası  
- node_modules / build klasörleri  

---

## 📤 4. Push Rules

- Kod çalışıyorsa push  
- Küçük parçalara böl  
- Büyük PR oluşturma  

❌ Çalışmayan kod pushlama

---

## 🔀 5. Pull Request Workflow

```
feature/<task> → dev
```

PR Gereksinimleri:

- Kod okunabilir  
- console.log yok  
- CI başarılı  
- Backend error vermiyor  
- Frontend build ediyor  

❌ Kendi PR’ını merge etme  
❌ main’e PR yok  

---

## 📋 6. PR Before Submit Checklist

- [ ] Kod local’de hatasız  
- [ ] npm install sonrası sorun yok  
- [ ] Route/service yapısı doğru  
- [ ] console.log yok  
- [ ] Comment-out kod yok  
- [ ] .env commit edilmedi  
- [ ] Dosya isimlendirme uygun  
- [ ] PR açıklaması net  

---

## 🔍 7. PR Review Rules

Reviewer şunları kontrol eder:

- Kod okunabilirliği  
- Naming conventions  
- Error handling  
- Güvenlik (JWT, SQL injection)  
- Folder yapısı  

---

## 🔀 8. Merge Rules

✔ Squash & Merge  
❌ Merge commit  
❌ Rebase merge  

Merge sonrası:  
✔ Feature branch silinir

---

## ⏳ 9. Daily Workflow (Günlük Çalışma Adımları)

```
1. git checkout dev
2. git pull
3. npm install
4. git checkout -b feature/<task>
5. Kod → commit → push
6. PR (feature → dev)
7. Review → düzelt → merge
8. Branch sil
```

---

## 🎯 10. Responsibility Breakdown

| Üye  | Modül     | Görevler |
|------|-----------|----------|
| Ahmet | Backend | Express API, JWT, PostgreSQL |
| Kadir | Frontend | UI, routing |
| Berat | AI | RAG, data cleaning, embeddings |
| Beşir | AWS&SCRUM | Deploy Etmek |

---

Bu CONTRIBUTING.md dosyası projenin düzenli ve sürdürülebilir geliştirilmesi için hazırlanmıştır.
