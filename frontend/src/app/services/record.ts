import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { API_URL } from '../core/api.config';
import { VerificationRecord } from '../models/record.model';

// The backend returns a different shape for Admin and General User.
interface RawRecord {
    id: number;
    employeeName?: string;
    verificationStatus?: string;
    document?: string;
    status?: string;
}

@Injectable({ providedIn: 'root' })
export class RecordService {
    private http = inject(HttpClient);

    getRecords(delay: number): Observable<VerificationRecord[]> {
        return this.http
            .get<RawRecord[]>(`${API_URL}/records`, { params: { delay } })
            .pipe(
                map((rows) =>
                    rows.map((r) => ({
                        id: r.id,
                        subject: r.employeeName ?? r.document ?? '',
                        status: r.verificationStatus ?? r.status ?? ''
                    }))
                )
            );
    }
}