import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../shared.module';

import { LinkToolsService } from './link-tools.service';

describe('LinkToolsService', () => {
  let service: LinkToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
    });
    service = TestBed.inject(LinkToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('isExternalLink is ok', () => {
    expect(service.isExternalLink("https://pbs.twimg.com/media/FhBx8ljX0AAVJLJ.jpg")).toBe(true);
    expect(service.isExternalLink("image.jpg")).toBe(false);
    expect(service.isExternalLink(environment.apiUrl)).toBe(false);
    expect(service.isExternalLink(environment.clientUrl)).toBe(false);
  });
  it('beginStartHttp is ok', () => {
    expect(service.beginStartHttp("https://pbs.twimg.com/media/FhBx8ljX0AAVJLJ.jpg")).toBe(true);
    expect(service.beginStartHttp("http://")).toBe(true);
    expect(service.beginStartHttp("")).toBe(false);
    expect(service.beginStartHttp("environment.clientUrl")).toBe(false);
  });
  it('buildLinkPictureMember is ok', () => {
    expect(service.buildLinkPictureMember("naruto.jpg")).toBe(`${environment.apiUrl}/media/upload/userPDP/naruto.jpg`);
    expect(service.buildLinkPictureMember("test.jpg")=="test.jpg").toBe(false);
  });
  it('buildLinkPictureTip is ok', () => {
    expect(service.buildLinkPictureTip("naruto.jpg")).toBe(`${environment.apiUrl}/media/upload/tipsPicture/naruto.jpg`);
    expect(service.buildLinkPictureTip("test.jpg")=="test.jpg").toBe(false);
  });
});
