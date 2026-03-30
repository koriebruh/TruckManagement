# Authenticated Background Tracking Guide

Panduan lengkap untuk implementasi **background location tracking dengan authentication** yang otomatis mengirim lokasi setiap 15 menit.

## 🎯 Fitur Utama

✅ **Auto-send setiap 15 menit** - Bahkan saat app tertutup
✅ **Requires Login** - Hanya user yang login bisa mengirim lokasi
✅ **Persistent State** - Tracking tetap aktif setelah app restart
✅ **Auto-start after Login** - Otomatis mulai tracking setelah login
✅ **Auto-stop after Logout** - Otomatis stop tracking setelah logout
✅ **Token Refresh Support** - Auto-handle expired tokens
✅ **Fake GPS Detection** - Tidak akan mengirim lokasi palsu

---

## 📦 Setup (Step-by-Step)

### 1. Install Dependencies

```bash
npx expo install expo-task-manager @react-native-async-storage/async-storage
```

### 2. Rebuild App

**PENTING:** Background tracking memerlukan native build!

```bash
npx expo prebuild
npx expo run:android
# atau
npx expo run:ios
```

### 3. Konfigurasi Sudah Lengkap

File yang sudah dikonfigurasi:
- ✅ [app.json](app.json) - Permissions Android & iOS
- ✅ [backgroundLocationService.ts](services/backgroundLocationService.ts) - Background task dengan auth
- ✅ [trackingStateService.ts](services/trackingStateService.ts) - Persistent state
- ✅ [useAuthenticatedTracking.ts](hooks/useAuthenticatedTracking.ts) - Auth-based tracking hook

---

## 🚀 Cara Menggunakan

### Opsi 1: Menggunakan TrackingControl Component (Recommended)

Cara paling mudah - tinggal import dan pakai:

```tsx
import { TrackingControl } from '@/components/TrackingControl';

function DriverScreen() {
  return (
    <View>
      <Text>Driver Dashboard</Text>
      <TrackingControl />
    </View>
  );
}
```

**Fitur TrackingControl:**
- UI toggle untuk start/stop tracking
- Auto-handle permissions
- Status indicator
- Error messages
- Confirmation dialogs

---

### Opsi 2: Menggunakan Hook Langsung

Untuk custom UI atau logic:

```tsx
import { useAuthenticatedTracking } from '@/hooks/useAuthenticatedTracking';

function CustomDriverScreen() {
  const {
    isTracking,
    isLoading,
    hasPermission,
    error,
    startTracking,
    stopTracking,
    requestPermissions,
  } = useAuthenticatedTracking({
    autoStart: true, // Auto-start setelah login
    interval: 900000, // 15 minutes
    distanceInterval: 100, // 100 meter
  });

  return (
    <View>
      <Text>Tracking: {isTracking ? 'Active' : 'Inactive'}</Text>

      {!hasPermission && (
        <Button title="Grant Permissions" onPress={requestPermissions} />
      )}

      <Button
        title={isTracking ? 'Stop Tracking' : 'Start Tracking'}
        onPress={isTracking ? stopTracking : startTracking}
        disabled={isLoading}
      />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}
```

---

## 🔐 Authentication Flow

### Login → Auto-Start Tracking

```tsx
// Dalam component login
import { useLogin } from '@/hooks/useAuth';
import { useAuthenticatedTracking } from '@/hooks/useAuthenticatedTracking';

function LoginScreen() {
  const { handleLogin } = useLogin();
  const tracking = useAuthenticatedTracking({ autoStart: true });

  const onLogin = async (credentials) => {
    await handleLogin(credentials);
    // Tracking akan otomatis dimulai oleh hook!
  };

  return <LoginForm onSubmit={onLogin} />;
}
```

**Flow:**
1. User login
2. Access token disimpan ke SecureStore
3. `useAuthenticatedTracking` detect login
4. Auto-request permissions (jika belum)
5. Auto-start background tracking
6. Lokasi dikirim setiap 15 menit dengan auth header

---

### Logout → Auto-Stop Tracking

```tsx
import { useLogout } from '@/hooks/useAuth';

function ProfileScreen() {
  const { handleLogout } = useLogout();

  const onLogout = async () => {
    await handleLogout();
    // Tracking akan otomatis berhenti!
  };

  return <Button title="Logout" onPress={onLogout} />;
}
```

**Flow:**
1. User logout
2. Tokens dihapus dari SecureStore
3. `useAuthenticatedTracking` detect logout
4. Auto-stop background tracking
5. Tracking state direset

---

## 📱 App Restart → Restore Tracking

Tracking tetap aktif setelah app restart:

**Flow:**
1. App di-close atau device restart
2. User buka app lagi
3. Auth context restore token dari SecureStore
4. `useAuthenticatedTracking` check tracking state
5. Jika tracking sebelumnya aktif → Auto-restart
6. Lokasi terus dikirim setiap 15 menit

---

## ⚙️ Konfigurasi

### Default Configuration

```typescript
{
  autoStart: true,        // Auto-start setelah login
  interval: 900000,       // 15 minutes (milliseconds)
  distanceInterval: 100   // 100 meter
}
```

### Custom Configuration

```tsx
const tracking = useAuthenticatedTracking({
  autoStart: true,
  interval: 600000,        // 10 menit
  distanceInterval: 50,    // 50 meter
});
```

---

## 🔒 Security & Authentication

### Bagaimana Token Dikirim?

Background task mengambil token dari SecureStore:

```typescript
// Di backgroundLocationService.ts
const accessToken = await SecureStore.getItemAsync('access_token');

await axios.post('/api/delivery/position', payload, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Handle Expired Token

Jika token expired (401 response):
1. Background service detect 401
2. Auto-stop tracking
3. User harus login ulang
4. Tracking auto-start lagi setelah login

---

## 🎛️ Permissions

### Android Permissions

Sudah dikonfigurasi di [app.json](app.json):

```json
"permissions": [
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.ACCESS_BACKGROUND_LOCATION",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.FOREGROUND_SERVICE_LOCATION"
]
```

### iOS Permissions

Sudah dikonfigurasi di [app.json](app.json):

```json
"infoPlist": {
  "UIBackgroundModes": ["location"],
  "NSLocationAlwaysAndWhenInUseUsageDescription": "...",
  "NSLocationAlwaysUsageDescription": "..."
}
```

### Runtime Permission Request

Hook akan otomatis request permissions saat pertama kali tracking dimulai:

1. Request **foreground permission** dulu
2. Kemudian request **background permission**
3. Jika granted → Start tracking
4. Jika denied → Show error message

---

## 📊 Tracking Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                     App Lifecycle                        │
└─────────────────────────────────────────────────────────┘

User Not Logged In
      │
      ├─► Login
      │      │
      │      ├─► Request Permissions
      │      │      │
      │      │      ├─► Granted
      │      │      │      │
      │      │      │      ├─► Start Background Tracking
      │      │      │      │      │
      │      │      │      │      ├─► Send Location Every 15min
      │      │      │      │      │      │
      │      │      │      │      │      ├─► App Closed
      │      │      │      │      │      │      │
      │      │      │      │      │      │      ├─► Still Sending! ✅
      │      │      │      │      │      │      │
      │      │      │      │      │      │      ├─► App Restarted
      │      │      │      │      │      │      │      │
      │      │      │      │      │      │      │      ├─► Restore State
      │      │      │      │      │      │      │      │      │
      │      │      │      │      │      │      │      │      ├─► Resume Tracking ✅
      │      │      │      │      │      │
      │      │      │      │      │      ├─► Logout
      │      │      │      │      │      │      │
      │      │      │      │      │      │      ├─► Stop Tracking
      │      │      │      │      │      │      │
      │      │      │      │      │      │      └─► Clear State
      │      │      │
      │      │      └─► Denied
      │      │             │
      │      │             └─► Show Error
      │
      └─► User Remains Logged In After Restart
             │
             └─► Auto-Restore Tracking ✅
```

---

## 🧪 Testing

### 1. Test Login Flow

```
1. Logout (jika sudah login)
2. Login dengan credentials
3. Grant location permissions
4. Check console logs: "✅ Authenticated tracking started"
5. Check: Status "Active"
```

### 2. Test Background Sending

```
1. Start tracking
2. Minimize app (tombol Home, JANGAN swipe up)
3. Tunggu 15 menit
4. Check backend logs: Lokasi harus terkirim
5. Check console logs di device
```

### 3. Test App Restart

```
1. Start tracking
2. Force close app (swipe up dari recent apps)
3. Buka app lagi
4. Wait for auth restoration
5. Check: Tracking auto-resumed
```

### 4. Test Logout

```
1. Tracking sedang aktif
2. Logout
3. Check console logs: "🔒 User logged out, stopping tracking"
4. Check: Status "Inactive"
```

### 5. Monitor Logs

**Android:**
```bash
npx react-native log-android
```

**iOS:**
```bash
npx react-native log-ios
```

**Look for:**
- `📤 Background: Sending position`
- `✅ Background: Position sent successfully`
- `🚀 Starting authenticated tracking`
- `🔄 Restoring tracking state`

---

## ⚠️ Troubleshooting

### ❌ Tracking tidak auto-start setelah login

**Solusi:**
1. Check `autoStart` option:
   ```tsx
   useAuthenticatedTracking({ autoStart: true })
   ```
2. Check permissions granted:
   ```tsx
   console.log('Has permission:', hasPermission);
   ```
3. Check console logs untuk errors

---

### ❌ Lokasi tidak terkirim setelah app di-close

**Solusi:**
1. **Android 12+**: Disable battery optimization
   - Settings → Apps → Tracking Truck
   - Battery → Unrestricted
2. Check `FOREGROUND_SERVICE_LOCATION` permission di [app.json](app.json)
3. Rebuild app: `npx expo run:android`

---

### ❌ 401 Unauthorized di background

**Solusi:**
1. Check token masih valid:
   ```tsx
   const { access_token } = useAuth();
   console.log('Token:', access_token);
   ```
2. Check backend endpoint `/api/delivery/position` accessible
3. Check token format: `Bearer <token>`

---

### ❌ Tracking tidak restore setelah app restart

**Solusi:**
1. Check tracking state saved:
   ```tsx
   import { TrackingStateService } from '@/services/trackingStateService';
   const state = await TrackingStateService.getTrackingState();
   console.log('Saved state:', state);
   ```
2. Check auth restored:
   ```tsx
   const { isAuthenticated } = useAuth();
   console.log('Is authenticated:', isAuthenticated);
   ```
3. Check `autoStart: true` di options

---

### ❌ Fake GPS tidak terdeteksi

**Check:**
```
🚫 Background: Fake GPS detected, skipping send
```

Jika tidak muncul saat menggunakan fake GPS:
1. Check `location.mocked` property
2. Test dengan app lain (Google Maps detect fake GPS?)

---

## 📝 API Endpoint

### Backend Endpoint Expected

```
POST /api/delivery/position
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "latitude": -6.200000,
  "longitude": 106.816666,
  "recorded_at": 1704067200
}
```

### Response Expected

```json
{
  "status": 200,
  "message": "Position received",
  "data": { ... }
}
```

---

## 🔧 Advanced Configuration

### Mengubah Interval

```tsx
// Kirim setiap 5 menit atau 50 meter
const tracking = useAuthenticatedTracking({
  interval: 300000,      // 5 menit
  distanceInterval: 50,  // 50 meter
});
```

### Manual Control (Disable Auto-Start)

```tsx
const tracking = useAuthenticatedTracking({
  autoStart: false, // User harus manual start
});

// Kemudian manual start
<Button title="Start" onPress={tracking.startTracking} />
```

### Custom Error Handling

```tsx
const { error } = useAuthenticatedTracking();

useEffect(() => {
  if (error) {
    Alert.alert('Tracking Error', error);
  }
}, [error]);
```

---

## 📚 File Structure

```
FE/
├── services/
│   ├── backgroundLocationService.ts   # Background task dengan auth
│   ├── trackingStateService.ts        # Persistent state management
│   └── axios.ts                        # API client dengan token interceptor
├── hooks/
│   ├── useAuthenticatedTracking.ts    # Main hook untuk tracking
│   ├── useAuth.ts                     # Auth hooks
│   └── usePositionTracker.ts          # Low-level tracking (optional)
├── components/
│   └── TrackingControl.tsx            # Ready-to-use UI component
├── context/
│   └── AuthContext.tsx                # Auth state management
└── app.json                           # Native permissions config
```

---

## 🎯 Best Practices

### 1. Selalu Check Authentication

```tsx
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <LoginPrompt />;
}

return <TrackingControl />;
```

### 2. Handle Permission Gracefully

```tsx
const { hasPermission, requestPermissions } = useAuthenticatedTracking();

if (!hasPermission) {
  return (
    <PermissionRequest onGrant={requestPermissions} />
  );
}
```

### 3. Show Tracking Status

```tsx
const { isTracking } = useAuthenticatedTracking();

return (
  <View>
    <StatusIndicator active={isTracking} />
    {isTracking && <Text>Sending location every 15 min</Text>}
  </View>
);
```

### 4. Battery Optimization Warning (Android)

```tsx
import { Platform, Linking, Alert } from 'react-native';

const showBatteryOptimizationWarning = () => {
  if (Platform.OS === 'android') {
    Alert.alert(
      'Battery Optimization',
      'For best tracking, disable battery optimization for this app.',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Settings', onPress: () => Linking.openSettings() }
      ]
    );
  }
};
```

---

## ⚡ Performance Tips

1. **Interval 15 menit** sudah optimal untuk battery life
2. Gunakan **`distanceInterval`** untuk hemat data saat tidak bergerak
3. **Jangan set interval terlalu rendah** (< 5 menit) → battery drain
4. Background task **sangat efisien** - tidak perlu app terbuka

---

## 🚨 Important Notes

1. **Rebuild Required**: Background tracking butuh native build (`npx expo run-android`)
2. **Tidak Bekerja di Expo Go**: Harus development/production build
3. **Test di Real Device**: Emulator tidak reliable untuk background location
4. **User Harus Login**: Tracking hanya jalan saat authenticated
5. **Foreground Service**: Android akan tampilkan notifikasi persisten
6. **iOS Blue Bar**: iOS tampilkan blue bar saat background tracking aktif

---

## ✅ Summary

Sistem ini memberikan:

✅ Automatic tracking setelah login
✅ Lokasi terkirim setiap 15 menit BAHKAN saat app tertutup
✅ Persistent tracking (survive app restart)
✅ Authenticated requests (dengan token)
✅ Auto-stop saat logout
✅ Fake GPS detection
✅ Battery efficient
✅ Ready-to-use component

**Tinggal pakai `<TrackingControl />` dan semuanya otomatis berjalan!** 🎉

---

## 📞 Support

Jika ada masalah, check:
1. Console logs untuk error messages
2. Backend logs untuk request failures
3. [BACKGROUND_TRACKING.md](BACKGROUND_TRACKING.md) untuk detail teknis
4. Device settings untuk permissions

---

**Happy Tracking! 🚚📍**
