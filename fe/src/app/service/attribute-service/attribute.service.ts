import {Injectable} from '@angular/core';
import {View} from '../../model/view.model';
import {Observable, of} from 'rxjs';
import {Attribute, Attribute2} from '../../model/attribute.model';
import config from '../../../assets/config.json';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../model/response.model';

const URL_ALL_ATTRIBUTES = `${config.api_host_url}/attributes/view/:viewId`;


@Injectable()
export class AttributeService {

  constructor(private httpClient: HttpClient) {}


  getAllAttributesByView(viewId: number): Observable<Attribute2[]> {
    return this.httpClient.get<Attribute2[]>(URL_ALL_ATTRIBUTES.replace(':viewId', String(viewId)));
  }

  deleteAttribute(view: View, attribute: Attribute2): Observable<ApiResponse> {
    // todo
      return of({} as ApiResponse);
  }

  searchAttribute(view: View, search: string): Observable<Attribute2[]> {
    // todo
      return of([]);
  }

  addAttribute(view: View, attribute: Attribute2): Observable<ApiResponse> {
    // todo:
     return of({} as ApiResponse);
  }

  updateAttribute(view: View, attribute: Attribute2): Observable<ApiResponse> {
    // todo:
     return of({} as ApiResponse);
  }
}

