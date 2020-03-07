import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { Overlay, Icon, Button } from 'react-native-elements';
import Theme from "../constants/Theme.js";
import OverlayStore from "../store/OverlayStore";
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Layer from '../entities/Layer.js';
import { Tracking } from '../entities/Tracking.js';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import TrackingStore from '../store/TrackingStore';
import Photo from '../entities/Photo.js';
import ImageView from 'react-native-image-view';

@observer
export default class TrackingOverlay extends React.Component {

    @observable
    loading: boolean = true;

    @observable
    private tracking: Tracking;

    @observable
    private photos: Photo[] = [];

    @observable
    private componentPhotos: any[] = [];

    @observable
    private isImageViewVisible: boolean = false;

    private closeFunction;
    private loadTrackingTrack;

    async getPhotos() {
        this.photos = await (await TrackingStore.getPhotos(this.tracking.id)).data;
        this.componentPhotos = this.photos.map(x => {
            return {
                source: {
                    uri: x.getUrl()
                },
                title: x.uploaderName
            }
        });
    }

    async addPhoto() {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
              return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        console.log(result);

        if (!result.cancelled) {
            // save to action queue
        }
    }

    async componentDidMount() {
        this.loading = true;
        this.tracking = this.props.selectedTracking;
        this.closeFunction = this.props.close;
        this.loadTrackingTrack = this.props.loadTrackingTrack;
        await this.getPhotos();
        this.loading = false;
    }

    render() {
        return (
            <Overlay
                isVisible={true}
                windowBackgroundColor="rgba(255, 255, 255, .5)"
                overlayStyle={{display: "flex", backgroundColor: "#fff", flexDirection: "column", alignItems: "center", alignContent: "center", padding: 0}}
                onBackdropPress={() => { this.closeFunction() }}
                width="auto"
                height="auto"
              >
              <View style={{  }}>
                {this.loading && <View><MaterialIndicator color={ Theme.colors.brand.primary }/></View>}
                {!this.loading &&
                <View>
                    <View style={{ backgroundColor: Theme.colors.brand.primary }}>
                        <View style={{ display: "flex", flexDirection: "row", padding: 10 }}>
                            <Text style={{ color: "#fff" }}>
                                {this.tracking.getName()}
                            </Text>

                            <Text style={{ color: "#fff" }}>
                                {this.tracking.sex}
                            </Text>

                            <Text style={{ color: "#fff" }}>
                                {this.tracking.age}
                            </Text>
                        </View>
                    </View>

                    <View style={{ padding: 10 }}>
                        <View>
                            <Text>
                                Species
                            </Text>
                            <Text>
                                {this.tracking.species?.scientificName}
                            </Text>
                        </View>

                        <View>
                            <Text>
                                Last position
                            </Text>
                            <Text>
                                {this.tracking.lastPosition?.admin1}
                                {this.tracking.lastPosition?.admin2}
                                {this.tracking.lastPosition?.settlement}
                                {this.tracking.lastPosition?.country}
                            </Text>
                        </View>

                        <View>
                                <Text>
                                    Note
                                </Text>
                                <Text>
                                    {this.tracking.note}
                                </Text>
                            </View>
                    </View>

                    <View style={{ height: 140 }}>
                        <View>
                            <View style={{ backgroundColor: Theme.colors.brand.primary, padding: 10 }}>
                                <Text style={{ color: "#fff" }}>
                                    Gallery
                                </Text>
                            </View>
                            <ScrollView horizontal={true} style={{ height: 100 }}>
                                <TouchableOpacity 
                                    style={{ display: "flex", flexDirection: "row", padding: 10, backgroundColor: 'red' }} 
                                    onPress={() => { this.isImageViewVisible = true; }}
                                >
                                    <ImageView
                                        images={this.componentPhotos}
                                        imageIndex={0}
                                        isVisible={this.isImageViewVisible}
                                        renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
                                        onClose={() => { this.isImageViewVisible = false; }}
                                    />
                                    {this.photos.map(x => {
                                        return (
                                            <View key={x.id} style={{ height: 80, width: 80 }}>
                                                <Image
                                                    style={{ width: 80, height: 80 }}
                                                    source={{ uri: x.getThumbUrl() }}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        )
                                    })}
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>

                    <View>
                        <View>
                            <View style={{ backgroundColor: Theme.colors.brand.primary, padding: 10 }}>
                                <Text style={{ color: "#fff" }}>
                                    Actions
                                </Text>
                            </View>

                            <View style={{ display: "flex", flexDirection: "row" }}>
                                <View style={styles.iconColumn}>
                                    <Icon
                                        raised
                                        name='sticky-note'
                                        type='font-awesome'
                                        color={Theme.colors.brand.primary}
                                        onPress={() => {  }}
                                    />
                                    <Text style={{ textAlign: "center" }}>
                                        Add note
                                    </Text>
                                </View>

                                <View style={styles.iconColumn}>
                                    <Icon
                                        raised
                                        name='camera'
                                        type='font-awesome'
                                        color={Theme.colors.brand.primary}
                                        onPress={async () => { await this.addPhoto() }}
                                    />
                                    <Text style={{ textAlign: "center" }}>
                                        Add photo
                                    </Text>
                                </View>

                                <View style={styles.iconColumn}>
                                    <Icon
                                        raised
                                        name='map-marker'
                                        type='font-awesome'
                                        color={Theme.colors.brand.primary}
                                        onPress={() => { this.loadTrackingTrack() }}
                                    />
                                    <Text style={{ textAlign: "center" }}>
                                        Load track
                                    </Text>
                                </View>

                                <View style={styles.iconColumn}>
                                    <Icon
                                        raised
                                        name='wifi'
                                        type='font-awesome'
                                        color={Theme.colors.brand.primary}
                                        onPress={() => {  }}
                                    />
                                    <Text style={{ textAlign: "center" }}>
                                        Offline
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                }
              </View>

            </Overlay>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: Theme.colors.default.background,
    },
    buttonPad: {
      padding: 2,
    },
    fullWidthCard: {
      flex: 1,
      padding: 10,
      height: 10,
    },
    iconColumn: {
        padding: 5,
        textAlign: "center"
    }
  });
  