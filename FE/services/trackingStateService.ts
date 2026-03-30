// services/trackingStateService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRACKING_STATE_KEY = 'tracking_state';
const TRACKING_CONFIG_KEY = 'tracking_config';

export interface TrackingState {
  isActive: boolean;
  startedAt: string | null;
  lastSentAt: string | null;
}

export interface TrackingConfig {
  interval: number; // milliseconds
  distanceInterval: number; // meters
}

export class TrackingStateService {
  /**
   * Save tracking state to persistent storage
   */
  static async saveTrackingState(state: TrackingState): Promise<void> {
    try {
      await AsyncStorage.setItem(TRACKING_STATE_KEY, JSON.stringify(state));
      console.log('💾 Tracking state saved:', state);
    } catch (error) {
      console.error('❌ Failed to save tracking state:', error);
    }
  }

  /**
   * Get tracking state from persistent storage
   */
  static async getTrackingState(): Promise<TrackingState | null> {
    try {
      const stateJson = await AsyncStorage.getItem(TRACKING_STATE_KEY);
      if (stateJson) {
        const state = JSON.parse(stateJson);
        console.log('📖 Tracking state loaded:', state);
        return state;
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get tracking state:', error);
      return null;
    }
  }

  /**
   * Set tracking as active
   */
  static async setActive(): Promise<void> {
    const state: TrackingState = {
      isActive: true,
      startedAt: new Date().toISOString(),
      lastSentAt: null,
    };
    await this.saveTrackingState(state);
  }

  /**
   * Set tracking as inactive
   */
  static async setInactive(): Promise<void> {
    const state: TrackingState = {
      isActive: false,
      startedAt: null,
      lastSentAt: null,
    };
    await this.saveTrackingState(state);
  }

  /**
   * Update last sent time
   */
  static async updateLastSent(): Promise<void> {
    const currentState = await this.getTrackingState();
    if (currentState) {
      currentState.lastSentAt = new Date().toISOString();
      await this.saveTrackingState(currentState);
    }
  }

  /**
   * Check if tracking should be active
   */
  static async shouldBeTracking(): Promise<boolean> {
    const state = await this.getTrackingState();
    return state?.isActive ?? false;
  }

  /**
   * Clear tracking state
   */
  static async clearTrackingState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TRACKING_STATE_KEY);
      console.log('🗑️ Tracking state cleared');
    } catch (error) {
      console.error('❌ Failed to clear tracking state:', error);
    }
  }

  /**
   * Save tracking configuration
   */
  static async saveTrackingConfig(config: TrackingConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(TRACKING_CONFIG_KEY, JSON.stringify(config));
      console.log('💾 Tracking config saved:', config);
    } catch (error) {
      console.error('❌ Failed to save tracking config:', error);
    }
  }

  /**
   * Get tracking configuration
   */
  static async getTrackingConfig(): Promise<TrackingConfig | null> {
    try {
      const configJson = await AsyncStorage.getItem(TRACKING_CONFIG_KEY);
      if (configJson) {
        const config = JSON.parse(configJson);
        console.log('📖 Tracking config loaded:', config);
        return config;
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get tracking config:', error);
      return null;
    }
  }

  /**
   * Get default tracking configuration
   */
  static getDefaultConfig(): TrackingConfig {
    return {
      interval: 900000, // 15 minutes
      distanceInterval: 100, // 100 meters
    };
  }
}
