FROM node:0.10-onbuild

RUN chmod o=rwx -R /usr/src/app/tmp/
RUN chmod o=rwx -R /usr/src/app/public/static/user/photo/

EXPOSE 80
