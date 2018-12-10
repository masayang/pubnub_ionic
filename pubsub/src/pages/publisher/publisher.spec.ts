import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, NavController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';
import { PublisherPage } from './publisher';
import { PubNubAngular } from 'pubnub-angular2';
import { NavControllerMock, StorageMock, PubNubAngularMock } from '../../../test-config/mocks-ionic';

describe('Page: PublisherPage', () => {
    function generateFixture() {
        fixture = TestBed.createComponent(PublisherPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    let component: PublisherPage;
    let fixture: ComponentFixture<PublisherPage>;

    beforeEach(async(() => {
        spyOn(PubNubAngularMock.prototype, 'init');
        spyOn(StorageMock.prototype, 'get').and.returnValue(
            new Promise((resolve) => {
                resolve('READY');
            }));

        TestBed.configureTestingModule({
            declarations: [
                MyApp,
                PublisherPage
            ],
            providers: [
                { provide: NavController, useClass: NavControllerMock },
                { provide: Storage, useClass: StorageMock },
                { provide: PubNubAngular, useClass: PubNubAngularMock },
            ],
            imports: [
                IonicModule.forRoot(MyApp),
            ]
        });

        generateFixture();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PublisherPage);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    it('should be created', () => {
        expect(component instanceof PublisherPage).toBe(true);
        expect(component.pubnub.init).toHaveBeenCalledWith({ publishKey: 'READY', subscribeKey: 'READY' })
        expect(component.storage.get).toHaveBeenCalledTimes(3);
        expect(component.storage.get).toHaveBeenCalledWith("publishKey");
        expect(component.storage.get).toHaveBeenCalledWith("subscribeKey");
        expect(component.storage.get).toHaveBeenCalledWith("channel");
    });

    it('isReadyToPublish() is ok', () => {
        component.name = null;
        expect(component.isReadyToPublish()).toBeFalsy();

        component.name == "";
        expect(component.isReadyToPublish()).toBeFalsy();

        component.name = "masayang";
        component.publishKey = null;
        expect(component.isReadyToPublish()).toBeFalsy();

        component.publishKey = "";
        expect(component.isReadyToPublish()).toBeFalsy();

        component.publishKey = "key";
        component.subscribeKey = null;
        expect(component.isReadyToPublish()).toBeFalsy();

        component.subscribeKey = "";
        expect(component.isReadyToPublish()).toBeFalsy();

        component.subscribeKey = "key";
        component.channel = null;
        expect(component.isReadyToPublish()).toBeFalsy();

        component.channel = "";
        expect(component.isReadyToPublish()).toBeFalsy();

        component.channel = "channel";
        expect(component.isReadyToPublish()).toBeTruthy();
    });

    it('publish is working', () => {
        spyOn(component.pubnub, 'publish');
        component.name = "name";
        component.channel = "channel";

        component.publish();
        expect(component.pubnub.publish).toHaveBeenCalledWith(
            {
                message: {
                    name: 'name' ,    
                },
                channel: 'channel'  
            }
        )
    });
});