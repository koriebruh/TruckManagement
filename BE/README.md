

```bash
docker-compose up -d --build
````

```bash
docker exec -i mysql-db mysql -u korie -pkorie123 truck_management < seedingCity.sql
```


<p style="color:red; font-family:Courier New; font-size:16px;">
🚨Case 1 No GPS update in the last 10 minutes!
</p>


```bash
Timeline:
10:00 - Driver mulai delivery (GPS normal)
10:05 - GPS update terakhir (lat: -6.9667, lon: 110.4167)
10:15 - GPS mati/hilang (tidak ada update)
10:20 - Method detectLostGPS() dijalankan

Expected Result:
✅ GPS_LOST alert dibuat dengan message "No GPS update in the last 10 minutes"
```

<p style="color:red; font-family:Courier New; font-size:16px;">
🚨 Case 2 Transit Point Illegal Stop!
</p>

```bash
Timeline:
09:00 - Delivery dimulai
09:30 - TRANSIT alert dibuat (driver masuk area transit)
10:15 - Driver berhenti di transit point
10:20 - Method detectLostGPS() dijalankan (belum 45 menit)
11:20 - Method detectLostGPS() dijalankan lagi

Expected Result at 10:20:
❌ Tidak ada alert (belum 45 menit)

Expected Result at 11:20:
✅ ILLEGAL_STOP alert dibuat karena sudah 45+ menit di transit point
```

<p style="color:red; font-family:Courier New; font-size:16px;">
🚨 Case 3 Duplicate Alert Prevention!
</p>

```bash
Timeline:
10:00 - Driver di koordinat (-6.9667, 110.4167)
10:15 - Driver masih di koordinat (-6.9668, 110.4168) // 15 meter dari posisi awal
10:30 - Driver masih di koordinat (-6.9669, 110.4166) // 25 meter dari posisi awal  
10:45 - Driver masih di koordinat (-6.9665, 110.4169) // 50 meter dari posisi awal
11:00 - Method detectLostGPS() dijalankan

Expected Result:
✅ ILLEGAL_STOP alert dibuat karena driver stay dalam radius 100m selama 45+ menit
Message: "Vehicle stationary at same location for 45+ minutes. Location: (-6.9665, 110.4169)"
```

<p style="color:red; font-family:Courier New; font-size:16px;">
🚨  Case 4 Duplicate Alert Prevention!
</p>


```bash
Timeline:
10:00 - GPS_LOST alert dibuat
10:05 - Method detectLostGPS() dijalankan lagi
10:35 - Method detectLostGPS() dijalankan lagi

Expected Result at 10:05:
❌ Tidak ada alert baru (masih dalam 10 menit dari alert sebelumnya)

Expected Result at 10:35:
✅ GPS_LOST alert baru bisa dibuat (sudah 35 menit dari alert pertama)
```


<p style="color:red; font-family:Courier New; font-size:16px;">
🚨 Case 5 Complex Mixed Scenario!
</p>


```bash
Timeline:
09:00 - Delivery start, GPS normal
09:30 - TRANSIT alert dibuat
09:45 - GPS hilang (tidak ada update)
09:55 - Method detectLostGPS() dijalankan
10:15 - GPS kembali normal di lokasi yang sama
11:00 - Method detectLostGPS() dijalankan

Expected Result at 09:55:
✅ GPS_LOST alert dibuat

Expected Result at 11:00:
❌ GPS_LOST tidak dibuat (GPS sudah normal)
✅ ILLEGAL_STOP alert dibuat (transit point > 45 menit)
❌ Location-based illegal stop tidak dibuat (GPS sempat hilang, jadi tidak ada data kontinyu)
```

<p style="color:red; font-family:Courier New; font-size:16px;">
🚨 Case 6 Complex Mixed Scenario!
</p>


```bash
Timeline:
10:00 - Delivery start di koordinat A
10:15 - Driver bergerak ke koordinat B (jarak 2 km)
10:30 - Driver bergerak ke koordinat C (jarak 1.5 km dari B)
10:45 - Method detectLostGPS() dijalankan

Expected Result:
❌ Tidak ada alert apapun (GPS normal, driver bergerak)
```
