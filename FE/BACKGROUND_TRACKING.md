# Background Location Tracking

Panduan lengkap untuk menggunakan fitur background location tracking di aplikasi Tracking Truck.

## Table of Contents
- [Instalasi](#instalasi)
- [Cara Kerja](#cara-kerja)
- [Penggunaan](#penggunaan)
- [Konfigurasi](#konfigurasi)
- [Permissions](#permissions)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Instalasi

1. Install dependencies yang diperlukan:
```bash
npx expo install expo-task-manager
```

2. Rebuild aplikasi (diperlukan karena menggunakan native modules):
```bash
npx expo prebuild
npx expo run:android
# atau
npx expo run:ios
```

---

## Cara Kerja

Background location tracking bekerja dengan cara:

1. **TaskManager** menjalankan task di background bahkan saat aplikasi tertutup
2. **expo-location** mengumpulkan koordinat GPS secara periodik
3. **Foreground Service** (Android) menampilkan notifikasi permanen saat tracking aktif
4. Setiap lokasi yang diterima **otomatis dikirim ke backend** via API
5. **Fake GPS detection** mencegah pengiriman lokasi palsu

### Interval Tracking

Ada 2 jenis interval:
- **timeInterval**: Waktu minimum antara update lokasi (default: 15 minutes / 900000ms)
- **distanceInterval**: Jarak minimum untuk trigger update (default: 100 meter)

Sistem akan mengirim update jika **salah satu kondisi terpenuhi**.

---

## Penggunaan

### Mode 1: Background Tracking (Recommended untuk Driver)

Tracking tetap berjalan meskipun aplikasi ditutup:

```tsx
import { usePositionTracker } from '@/hooks/usePositionTracker';

function DriverScreen() {
  const {
    isBackgroundTracking,
    hasBackgroundPermission,
    startBackgroundTracking,
    stopBackgroundTracking,
  } = usePositionTracker({
    interval: 900000, // 15 minutes
    distanceInterval: 100, // 100 meter
  });

  return (
    <View>
      {!hasBackgroundPermission && (
        <Text>⚠️ Background location permission required</Text>
      )}

      <Button
        title={isBackgroundTracking ? 'Stop Tracking' : 'Start Tracking'}
        onPress={() => {
          if (isBackgroundTracking) {
            stopBackgroundTracking();
          } else {
            startBackgroundTracking();
          }
        }}
      />

      {isBackgroundTracking && (
        <Text>✅ Background tracking active</Text>
      )}
    </View>
  );
}
```

### Mode 2: Auto-Start Background Tracking

Tracking otomatis dimulai saat komponen dimount:

```tsx
const tracker = usePositionTracker({
  autoTrack: true,
  useBackgroundTracking: true,
  interval: 900000, // 15 minutes
  distanceInterval: 100, // 100 meter
});

// Tracking akan otomatis berjalan di background
```

### Mode 3: Foreground Tracking Only

Hanya berjalan saat aplikasi terbuka (mode lama):

```tsx
const {
  isTracking,
  startTracking,
  stopTracking,
} = usePositionTracker({
  autoTrack: false,
  useBackgroundTracking: false, // ❌ Tidak menggunakan background
  interval: 900000,
});
```

---

## Konfigurasi

### Mengubah Interval Tracking

```tsx
// Kirim setiap 5 menit atau 50 meter
const tracker = usePositionTracker({
  interval: 300000, // 5 menit
  distanceInterval: 50, // 50 meter
});
```

### Mengubah Akurasi GPS

Edit [backgroundLocationService.ts](services/backgroundLocationService.ts):

```typescript
await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
  accuracy: Location.Accuracy.BestForNavigation, // Akurasi tertinggi
  // atau
  accuracy: Location.Accuracy.Balanced, // Balanced (hemat baterai)
});
```

### Mengubah Notifikasi (Android)

Edit [backgroundLocationService.ts](services/backgroundLocationService.ts):

```typescript
foregroundService: {
  notificationTitle: 'Pengiriman Aktif',
  notificationBody: 'Lokasi sedang dilacak',
  notificationColor: '#3b82f6',
}
```

---

## Permissions

### Android

Required permissions (sudah dikonfigurasi di [app.json](app.json)):
- `ACCESS_FINE_LOCATION` - GPS akurat
- `ACCESS_COARSE_LOCATION` - GPS approximate
- `ACCESS_BACKGROUND_LOCATION` - Tracking di background
- `FOREGROUND_SERVICE` - Service berjalan di background
- `FOREGROUND_SERVICE_LOCATION` - Khusus untuk location service

### iOS

Required keys di Info.plist (sudah dikonfigurasi di [app.json](app.json)):
- `NSLocationWhenInUseUsageDescription` - Saat app terbuka
- `NSLocationAlwaysAndWhenInUseUsageDescription` - Background tracking
- `NSLocationAlwaysUsageDescription` - Always location (iOS 10)
- `UIBackgroundModes` - `["location"]`

### Runtime Permission Flow

1. Pertama kali: Request **foreground permission**
2. Kemudian: Request **background permission** (Android 10+/iOS 13+)
3. User harus approve kedua permission untuk background tracking

---

## Testing

### 1. Test di Device Fisik (Recommended)

Background location **tidak bekerja optimal di emulator**. Gunakan device fisik:

```bash
# Android
npx expo run:android --device

# iOS
npx expo run:ios --device
```

### 2. Test Background Behavior

1. Start background tracking
2. Tekan tombol **Home** (jangan swipe up untuk close)
3. Biarkan selama beberapa menit
4. Check logs backend untuk memastikan lokasi terkirim

### 3. Monitor Logs

```bash
# Android
npx react-native log-android

# iOS
npx react-native log-ios
```

### 4. Simulasi Gerakan di Emulator

**Android Emulator:**
- Buka Extended Controls (3 dots)
- Location → Routes
- Import GPX atau buat route manual

**iOS Simulator:**
- Debug → Location → Custom Location
- Atau gunakan GPX file

---

## Troubleshooting

### ❌ Background tracking tidak berjalan

**Solusi:**
1. Pastikan sudah `npx expo prebuild` dan rebuild app
2. Check permissions:
   ```tsx
   const { hasBackgroundPermission } = usePositionTracker();
   console.log('Has permission:', hasBackgroundPermission);
   ```
3. Pastikan install `expo-task-manager`:
   ```bash
   npx expo install expo-task-manager
   ```

### ❌ Lokasi tidak terkirim ke backend

**Solusi:**
1. Check logs untuk error API
2. Pastikan endpoint `/api/delivery/position` accessible
3. Check apakah GPS terdeteksi sebagai fake:
   ```
   🚫 Background: Fake GPS detected, skipping send
   ```

### ❌ Android: App crash saat background tracking

**Solusi:**
1. Pastikan permissions di [app.json](app.json) sudah benar
2. Rebuild app:
   ```bash
   npx expo run:android
   ```
3. Check Android 12+ restrictions:
   - Buka Settings → Apps → Tracking Truck
   - Location → Allow all the time
   - Battery → Unrestricted

### ❌ iOS: Background tracking berhenti setelah beberapa menit

**Solusi:**
1. Check `UIBackgroundModes` di [app.json](app.json)
2. iOS membatasi background location jika device tidak bergerak
3. Gunakan `activityType: AutomotiveNavigation` untuk mode driving

### ❌ Battery drain terlalu tinggi

**Solusi:**
1. Naikkan `timeInterval` (misal 30 menit):
   ```tsx
   interval: 1800000 // 30 menit
   ```
2. Gunakan akurasi lebih rendah:
   ```typescript
   accuracy: Location.Accuracy.Balanced
   ```
3. Naikkan `distanceInterval`:
   ```tsx
   distanceInterval: 500 // 500 meter
   ```

---

## API Reference

### BackgroundLocationService

#### `start(options?)`

Memulai background location tracking.

**Parameters:**
- `accuracy?`: Location.Accuracy - Akurasi GPS
- `timeInterval?`: number - Interval waktu (ms)
- `distanceInterval?`: number - Interval jarak (meter)

**Returns:** `Promise<boolean>` - Success status

**Example:**
```typescript
import { BackgroundLocationService } from '@/services/backgroundLocationService';
import * as Location from 'expo-location';

const success = await BackgroundLocationService.start({
  accuracy: Location.Accuracy.High,
  timeInterval: 600000, // 10 menit
  distanceInterval: 200, // 200 meter
});
```

#### `stop()`

Menghentikan background tracking.

**Returns:** `Promise<boolean>` - Success status

#### `isRunning()`

Check apakah background tracking sedang berjalan.

**Returns:** `Promise<boolean>` - Running status

#### `checkPermissions()`

Check status permissions.

**Returns:** `Promise<{ foreground: PermissionStatus; background: PermissionStatus }>`

---

## Best Practices

### 1. Request Permissions Secara Bertahap

```tsx
// Jangan langsung request background permission
// Request foreground dulu, baru background

async function requestPermissions() {
  // Step 1: Foreground
  const { status: foreground } = await Location.requestForegroundPermissionsAsync();

  if (foreground !== 'granted') {
    alert('Foreground permission required');
    return;
  }

  // Step 2: Background (dengan penjelasan)
  Alert.alert(
    'Background Location',
    'To track deliveries, we need access to your location even when the app is closed.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Allow',
        onPress: async () => {
          await Location.requestBackgroundPermissionsAsync();
        }
      }
    ]
  );
}
```

### 2. Tampilkan Status Tracking

```tsx
const { isBackgroundTracking, lastSentAt } = usePositionTracker();

return (
  <View>
    {isBackgroundTracking && (
      <View>
        <Text>📍 Tracking Active</Text>
        {lastSentAt && (
          <Text>Last sent: {lastSentAt.toLocaleTimeString()}</Text>
        )}
      </View>
    )}
  </View>
);
```

### 3. Handle Battery Optimization (Android)

```tsx
import { Platform, Linking } from 'react-native';

if (Platform.OS === 'android') {
  Alert.alert(
    'Battery Optimization',
    'For best tracking, disable battery optimization for this app.',
    [
      { text: 'Later', style: 'cancel' },
      {
        text: 'Settings',
        onPress: () => {
          Linking.openSettings();
        }
      }
    ]
  );
}
```

---

## FAQ

**Q: Berapa lama tracking bisa berjalan di background?**
A: Tidak ada limit waktu, selama app tidak di-force close oleh user atau OS.

**Q: Apakah tracking tetap jalan jika phone restart?**
A: Tidak. User harus buka app dan start tracking lagi.

**Q: Berapa banyak battery yang terpakai?**
A: Tergantung interval dan akurasi. Dengan default (15 menit, high accuracy), sekitar 5-10% per hari.

**Q: Apakah bisa tracking di iOS saat app benar-benar closed?**
A: Ya, selama background location permission granted.

**Q: Bagaimana cara stop tracking otomatis saat delivery selesai?**
A: Panggil `stopBackgroundTracking()` setelah delivery completed.

---

## Notes

- Background location tracking memerlukan **rebuild app** setelah konfigurasi
- **Tidak bekerja di Expo Go** - harus build development atau production build
- Android 12+ memerlukan **FOREGROUND_SERVICE_LOCATION** permission
- iOS 13+ akan tampilkan blue bar saat background location aktif
- Fake GPS (mock location) akan **otomatis diabaikan**

---

## Resources

- [Expo Location Docs](https://docs.expo.dev/versions/latest/sdk/location/)
- [Expo TaskManager Docs](https://docs.expo.dev/versions/latest/sdk/task-manager/)
- [Android Background Location Best Practices](https://developer.android.com/training/location/background)
- [iOS Background Location](https://developer.apple.com/documentation/corelocation/getting_the_user_s_location/handling_location_events_in_the_background)
