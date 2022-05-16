import {createServiceFactory} from '@ngneat/spectator/jest';
import {DynamicDownloadService} from './dynamic-download.service';

describe('DynamicDownloadService', () => {

  const createService = createServiceFactory(DynamicDownloadService);

  it('should create a single anchor', () => {
    const anchor = document.createElement('a');
    jest.spyOn(document, 'createElement').mockReturnValueOnce(anchor);

    createService().service.download({
      fileName: 'xyz',
      contentType: 'application/json',
      content: 'hello'
    });
    expect(anchor).toMatchObject({
      download: 'xyz',
      href: `data:application/json;charset=utf-8,${encodeURIComponent('hello')}`
    })
  });

});
