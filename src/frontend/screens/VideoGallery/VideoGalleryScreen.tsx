import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface VideoItem {
  id: number;
  title: string;
  subtitle: string;
  source: any;
  thumbnail: string | any;
  isImage?: boolean;
}

const videos: VideoItem[] = [
  {
    id: 1,
    title: '¿Qué es la CNEE?',
    subtitle: 'Conoce la Comisión Nacional de Energía Eléctrica',
    source: require('../../assets/videos/Video 1 QUE ES LA CNEE.mov'),
    thumbnail: require('../../assets/imagenes-video/primera.png'),
    isImage: true,
  },
  {
    id: 2,
    title: 'Cómo funciona el Sector Eléctrico',
    subtitle: 'Generación, transmisión y distribución de energía',
    source: require('../../assets/videos/Video 2 COMO FUNCIONA EL SECTOR ELECTRICO.mov'),
    thumbnail: require('../../assets/imagenes-video/segunda.png'),
    isImage: true,
  },
  {
    id: 3,
    title: 'Cálculo del Precio de la Energía',
    subtitle: 'Aprende cómo se determinan las tarifas eléctricas',
    source: require('../../assets/videos/Video 3 COMO SE CALCULA EL PRECIO DE LA ENERGIA..mov'),
    thumbnail: require('../../assets/imagenes-video/tercera.png'),
    isImage: true,
  },
  {
    id: 4,
    title: 'Cómo leer la Tarifa Eléctrica',
    subtitle: 'Entiende tu recibo de luz paso a paso',
    source: require('../../assets/videos/Video 4 COMO LEER LA TARIFA ELECTRICA.mov'),
    thumbnail: require('../../assets/imagenes-video/cuarta.png'),
    isImage: true,
  },
  {
    id: 5,
    title: 'Cómo fiscaliza la CNEE',
    subtitle: 'Supervisión y regulación del sector eléctrico',
    source: require('../../assets/videos/Video 5 COMO FISCALIZA LA CNEE.mov'),
    thumbnail: require('../../assets/imagenes-video/quinta.png'),
    isImage: true,
  },
];

export default function VideoGalleryScreen() {
  const navigation = useNavigation();
  const videoRef = useRef<Video>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = async (seconds: number) => {
    if (!videoRef.current) return;
    const newPosition = Math.max(0, Math.min(duration, position + seconds * 1000));
    await videoRef.current.setPositionAsync(newPosition);
  };

  const handleVideoSelect = async (video: VideoItem) => {
    if (selectedVideo?.id === video.id) return;
    
    setIsPlaying(false);
    setPosition(0);
    setSelectedVideo(video);
    setShowControls(true);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setShowControls(true);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#0f172a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Galería de Videos</Text>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.cneeLogoHeader}
            resizeMode="contain"
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Video Player */}
          {selectedVideo && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowControls(!showControls)}
              style={styles.videoPlayerContainer}
            >
              <LinearGradient
                colors={['#1e3a8a', '#2563eb', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.videoCard}
              >
                <Video
                  ref={videoRef}
                  source={selectedVideo.source}
                  style={styles.video}
                  useNativeControls={false}
                  resizeMode={ResizeMode.CONTAIN}
                  onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                  shouldPlay={false}
                />

                {/* Controls Overlay */}
                {showControls && (
                  <View style={styles.controlsOverlay}>
                    {/* Title */}
                    <LinearGradient
                      colors={['rgba(0,0,0,0.8)', 'transparent']}
                      style={styles.topGradient}
                    >
                      <Text style={styles.videoTitle}>{selectedVideo.title}</Text>
                      <Text style={styles.videoSubtitle}>{selectedVideo.subtitle}</Text>
                    </LinearGradient>

                    {/* Bottom Controls */}
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.9)']}
                      style={styles.bottomGradient}
                    >
                      {/* Progress Bar */}
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${(position / duration) * 100}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.timeText}>
                          {formatTime(position)} / {formatTime(duration)}
                        </Text>
                      </View>

                      {/* Control Buttons */}
                      <View style={styles.controlButtons}>
                        <TouchableOpacity
                          style={styles.controlButton}
                          onPress={() => handleSkip(-10)}
                        >
                          <MaterialIcons name="replay-10" size={36} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.mainControlButton}
                          onPress={handlePlayPause}
                        >
                          <Ionicons
                            name={isPlaying ? 'pause-circle' : 'play-circle'}
                            size={64}
                            color="#06b6d4"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.controlButton}
                          onPress={() => handleSkip(10)}
                        >
                          <MaterialIcons name="forward-10" size={36} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Video List */}
          <Text style={styles.sectionTitle}>
            {selectedVideo ? 'Más Videos' : 'Selecciona un Video'}
          </Text>
          
          {videos.map((video, index) => (
            <TouchableOpacity
              key={video.id}
              onPress={() => handleVideoSelect(video)}
              activeOpacity={0.8}
              style={[
                styles.videoListItemContainer,
                index === videos.length - 1 && styles.lastVideoItem,
              ]}
            >
              {/* Glow effect siempre visible */}
              <View style={styles.glowEffect} />
              
              {selectedVideo?.id === video.id ? (
                <LinearGradient
                  colors={['#0a1628', '#1e3a5f', '#06b6d4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.videoListItem, styles.videoListItemSelected]}
                >
                  {/* Border brillante siempre visible */}
                  <View style={styles.borderGlow} />

                {/* Thumbnail */}
                <View style={styles.thumbnail}>
                  <View style={styles.thumbnailContainer}>
                    {video.isImage ? (
                      <Image 
                        source={video.thumbnail} 
                        style={styles.thumbnailImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.thumbnailEmoji}>{video.thumbnail}</Text>
                    )}
                  </View>
                  <View style={styles.playIconSmall}>
                    <Ionicons name="play" size={18} color="#fff" />
                  </View>
                </View>

                {/* Info */}
                <View style={styles.videoInfo}>
                  <Text style={styles.videoListTitle}>{video.title}</Text>
                  <Text style={styles.videoListSubtitle}>{video.subtitle}</Text>
                </View>

                {/* Selected Indicator */}
                {selectedVideo?.id === video.id && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={28} color="#06b6d4" />
                  </View>
                )}
                </LinearGradient>
              ) : (
                <View style={styles.videoListItem}>
                  {/* Border brillante siempre visible */}
                  <View style={styles.borderGlow} />

                  {/* Thumbnail */}
                  <View style={styles.thumbnail}>
                    <View style={styles.thumbnailContainer}>
                      {video.isImage ? (
                        <Image 
                          source={video.thumbnail} 
                          style={styles.thumbnailImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.thumbnailEmoji}>{video.thumbnail}</Text>
                      )}
                    </View>
                    <View style={styles.playIconSmall}>
                      <Ionicons name="play" size={18} color="#fff" />
                    </View>
                  </View>

                  {/* Info */}
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoListTitle}>{video.title}</Text>
                    <Text style={styles.videoListSubtitle}>{video.subtitle}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  cneeLogoHeader: {
    width: width * 0.2,
    height: height * 0.04,
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.15,
  },
  videoPlayerContainer: {
    marginBottom: height * 0.03,
  },
  videoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  video: {
    width: '100%',
    height: height * 0.3,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topGradient: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  videoSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  bottomGradient: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#06b6d4',
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  controlButton: {
    padding: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainControlButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  videoListItemContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    backgroundColor: '#06b6d4',
    opacity: 0.3,
    ...Platform.select({
      ios: {
        shadowColor: '#06b6d4',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  videoListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#06b6d4',
    backgroundColor: '#1e3a5f',
    ...Platform.select({
      ios: {
        shadowColor: '#06b6d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  videoListItemSelected: {
    backgroundColor: '#2563eb',
    ...Platform.select({
      ios: {
        shadowColor: '#06b6d4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.8,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  borderGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#06b6d4',
    opacity: 0.5,
  },
  lastVideoItem: {
    marginBottom: 0,
  },
  thumbnail: {
    position: 'relative',
    marginRight: 12,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  thumbnailEmoji: {
    fontSize: 40,
  },
  thumbnailImage: {
    width: 70,
    height: 70,
  },
  playIconSmall: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
  },
  videoListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  videoListSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  selectedIndicator: {
    marginLeft: 8,
  },
});

