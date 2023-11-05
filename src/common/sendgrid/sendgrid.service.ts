import * as SendGrid from '@sendgrid/mail';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { applicationConfig } from 'config';
import { emailTemplates } from 'src/utils/constants';
import { getErrorCodeAndMessage } from 'src/utils/helpers';

@Injectable()
export class SendgridService {
  constructor() {
    SendGrid.setApiKey(applicationConfig.sendgrid.sendgridApiKey);
  }

  getMessage(email: string, data: any) {
    return {
      to: email,
      from: applicationConfig.sendgrid.senderEmail,
      templateId: emailTemplates[data.templateName],
      dynamic_template_data: {
        otp: data.otp,
      },
    };
  }

  async sendEmail(email: string, data: any) {
    try {
      await SendGrid.send(this.getMessage(email, data));
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
