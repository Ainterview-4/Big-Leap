# API Design Standards (Swagger / OpenAPI)

Bu doküman, backend API tasarımında tutarlılığı sağlamak için kullanılan temel kuralları tanımlar.

---

## ✅ Rule 1 — API-design.md → openapi.yaml → backend kodu sırası

API geliştirme süreci her zaman aynı sırayı takip etmelidir:

1. **api-design.md**  
   - Yüksek seviye API tasarımının yapıldığı doküman.
   - Endpointler, input/output şemaları burada planlanır.

2. **openapi.yaml**  
   - Swagger/OpenAPI standardına uygun resmi API tanımı.
   - Frontend, QA, testler ve üçüncü partiler bu dosyaya göre çalışır.

3. **backend kodu**  
   - Controller, service ve route implementasyonu OpenAPI'ya göre yazılır.

Bu üç dosya birbirine tam olarak uyumlu olmalıdır.

---

## ✅ Rule 2 — Swagger, Backend API’nin Tek Kaynağıdır

Tüm ekiplerin referans noktası **openapi.yaml** dosyasıdır:
- Frontend bu dosyadan request formatını okur.
- Backend geliştiriciler endpointleri buna göre kodlar.
- QA testlerini buna göre yazar.
- Otomasyon testleri buradan üretilebilir.

Swagger'daki her değişiklik → backend koduna yansıtılmalıdır.

---

## ✅ Rule 3 — Tutarlı Response Formatı

Her endpoint'in dönüş formatı aynı yapıda olmalıdır:

```json
{
  "success": true,
  "data": {},
  "error": null
}
Bu standart:

loglamayı kolaylaştırır,

frontend ile iletişimi basitleştirir,

hata yönetimini tek tip yapar.

✅ Rule 4 — API Versioning (Opsiyonel)
Proje büyüdüğünde:

/api/v1/

