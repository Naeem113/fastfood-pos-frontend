/**
 * @Author Naeem
 * @since 2-19-26
 * @Description API endpoints for backend
 *
 **/

import { environment } from "../../../environments/environment";

let baseUrl = environment.apiBaseUrl;

export class URLConfig {
  public static login = baseUrl + 'auth/login';

  // Patient Module
  public static addPatient = baseUrl + 'HimsPatients/save-patient';
  public static addVisit = baseUrl + 'HimsPatients/add-visit';
  public static getPatients = baseUrl + 'HimsPatients/hims-patients';
  public static getPatient = baseUrl + 'HimsPatients/patient';
  public static updatePatientInfoById(patientId: number) {
    return baseUrl + 'HimsPatients/update-patient-info/' + patientId;
  }
  public static updateMedicalInfoById(medicalInfoId: number) {
    return baseUrl + 'HimsPatients/update-medical-info/' + medicalInfoId;
  }
  public static updateVisitById(visitId: number) {
    return baseUrl + 'HimsPatients/update-visit-info/' + visitId;
  }
  public static getPatientById(visitId: number) {
    return baseUrl + 'HimsPatients/visit-details/' + visitId;
  }
  public static getRecentVisits(patientId: number) {
    return baseUrl + 'HimsPatients/recent-visits/' + patientId;
  }
  public static getPatientStats = baseUrl + 'HimsPatients/patient-stats';

  // Reference/Referral mModule

  public static addReferral = baseUrl + 'HimsRef/add-referal'
  public static getReferences(hoid: number) {
    return baseUrl + 'HimsRef/referals/' + hoid;
  }

  // Relations Module
  public static addRelation = baseUrl + 'HimsRelations/add-relation'
  public static getRelations = baseUrl + 'HimsRelations/relations'

  // Users/Operators Module
  public static addUser = baseUrl + 'HimsOperators/add-operator'
  public static getUsers(hoid: number) {
    return baseUrl + 'HimsOperators/operators/' + hoid;
  }
  public static getUserById(id: number) {
    return baseUrl + 'HimsOperators/operator/' + id;
  }

  public static addUpdateUserRights(id: number) {
    return baseUrl + 'HimsOperators/operator/' + id;
  }

  // Doctor/Consultant Module
  public static addDoctor = baseUrl + 'HimsConsultant/add-Consultant'
  public static getDoctors(hoid: number) {
    return baseUrl + 'HimsConsultant/consultants/' + hoid;
  }
  public static getDoctorById(doctorId: number) {
    return baseUrl + 'HimsConsultant/consultant/' + doctorId;
  }

  // Department Module
  public static getDepartments = baseUrl + 'HimsServices/hims-departments';
  public static addDepartment = baseUrl + 'HimsServices/add-hims-department';

  // Visit Purpose Module
  public static getDoctorServices(drid: number) {
    return baseUrl + 'HimsServices/services-by-dr/' +drid;
  }

  public static getVisitPurposes(visitId: number) {
    return baseUrl + 'HimsVisits/visit-purposes/' + visitId;
  }

  public static deleteVisitPurpose(purposeId: number) {
    return baseUrl + 'HimsPatients/delete-visit-purpose/' + purposeId;
  }

  public static addService = baseUrl + 'HimsServices/add-service';

  // insurance provider module
  public static addInsuranceProvider = baseUrl + 'HimsRef/add-update-insurence-provider';
  public static getInsuranceProviders(hoid: number) {
    return baseUrl + 'HimsRef/insurence-providers/' + hoid;
  }


  //Reports
  public static getPatientReport(hoid: number) {
    return baseUrl + 'Reports/patient-report/'+ hoid;
  }
}

