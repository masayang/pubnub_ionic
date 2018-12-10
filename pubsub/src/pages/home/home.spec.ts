import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, NavController, Events } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { HomePage } from './home';
import { Storage } from '@ionic/storage';
import { NavControllerMock, StorageMock } from '../../../test-config/mocks-ionic';
import { ConfigPage } from '../config/config';
import { SubscriberPage } from '../subscriber/subscriber';
import { PublisherPage } from '../publisher/publisher';
import { ifError } from 'assert';

describe('Page: HomePage', () => {
    function generateFixture() {
        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;

    beforeEach(async(() => {
        spyOn(StorageMock.prototype, 'get').and.returnValue(
            new Promise((resolve) => {
                resolve('READY');
            })
        );

        TestBed.configureTestingModule({
            declarations: [
                MyApp,
                HomePage
            ],
            providers: [
                { provide: NavController, useClass: NavControllerMock },
                { provide: Storage, useClass: StorageMock },
            ],
            imports: [
                IonicModule.forRoot(MyApp),
            ]
        });

        generateFixture();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    it('should be created', () => {
        expect(component instanceof HomePage).toBe(true);
        expect(component.storage.get).toHaveBeenCalledTimes(3);
        expect(component.storage.get).toHaveBeenCalledWith("publishKey");
        expect(component.storage.get).toHaveBeenCalledWith("subscribeKey");
        expect(component.storage.get).toHaveBeenCalledWith("channel");
    });

    it('config works', () => {
        spyOn(component.navCtrl, 'push');
        component.config();
        expect(component.navCtrl.push).toHaveBeenCalledWith(ConfigPage, { keyVal: {} })
    });

    it('loadVariable works', () => {
        component.loadVariable("key");
        expect(component.storage.get).toHaveBeenCalledWith("key");
    });

    it('saveVariable works', () => {
        spyOn(component.storage, "set");
        component.saveVariable("key", "val")
        expect(component.storage.set).toHaveBeenCalledWith("key", "val")
    });

    it('isConfigReady works', () {
        component.keyVal = { publishKey: null };
        expect(component.isConfigReady()).toBeFalsy()

        component.keyVal = {
            publishKey: "publish key",
            subscribeKey: null
        };
        expect(component.isConfigReady()).toBeFalsy()

        component.keyVal = {
            publishKey: "publish key",
            subscribeKey: "subscribe key",
            channel: null
        };
        expect(component.isConfigReady()).toBeFalsy()

        component.keyVal = {
            publishKey: "publish key",
            subscribeKey: "subscribe key",
            channel: "channel"
        };
        expect(component.isConfigReady()).toBeTruthy()
    });

    it('subscribe works', () => {
        spyOn(component.navCtrl, 'push');
        component.subscriber();
        expect(component.navCtrl.push).toHaveBeenCalledWith(SubscriberPage)
    });

    it('publisher works', () => {
        spyOn(component.navCtrl, 'push');
        component.publisher();
        expect(component.navCtrl.push).toHaveBeenCalledWith(PublisherPage)
    });

    it('listens events', () => {
        spyOn(component, 'saveVariable');
        component.events.publish("KeyVal", "key", "val");
        expect(component.saveVariable).toHaveBeenCalledWith("key", "val");
    })
});