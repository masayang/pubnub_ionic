import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { NavControllerMock } from '../../../test-config/mocks-ionic';
import { MyApp } from '../../app/app.component';
import { ConfigPage } from './config';


describe('Page: ConfigPage', () => {
    const data = {
        "keyVal": {
            "publishKey": "publishKey",
            "subscribeKey": "subscribeKey",
            "channel": "channel"
        }
    };
    const navParams = new NavParams(data);

    function generateFixture() {
        fixture = TestBed.createComponent(ConfigPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    let component: ConfigPage;
    let fixture: ComponentFixture<ConfigPage>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [
                MyApp,
                ConfigPage
            ],
            providers: [
                { provide: NavController, useClass: NavControllerMock },
                { provide: NavParams, useValue: navParams }
            ],
            imports: [
                IonicModule.forRoot(MyApp),
            ]
        });

        generateFixture();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigPage);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    it('should be created', () => {
        expect(component instanceof ConfigPage).toBe(true);
        expect(component.keyVal).toEqual({
            "publishKey": "publishKey",
            "subscribeKey": "subscribeKey",
            "channel": "channel"
        })
    });

    it('save() works', () => {
        spyOn(component.navCtrl, 'pop');
        spyOn(component.events, 'publish');
        component.save();
        expect(component.navCtrl.pop).toHaveBeenCalledWith();
        expect(component.events.publish).toHaveBeenCalledTimes(3);
        expect(component.events.publish).toHaveBeenCalledWith('KeyVal', 'publishKey', 'publishKey');
        expect(component.events.publish).toHaveBeenCalledWith('KeyVal', 'subscribeKey', 'subscribeKey');
        expect(component.events.publish).toHaveBeenCalledWith('KeyVal', 'channel', 'channel');
    });
})
